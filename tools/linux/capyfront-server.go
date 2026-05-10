// go build -o capyfront-server capyfront-server.go

package main

import (
	"flag"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

// ── Multi-flag para -proxy ────────────────────────────────────────────────────

type proxyFlags []string

func (p *proxyFlags) String() string    { return strings.Join(*p, ", ") }
func (p *proxyFlags) Set(v string) error { *p = append(*p, v); return nil }

// ── Response writer con captura de status ─────────────────────────────────────

type statusWriter struct {
	http.ResponseWriter
	status int
}

func (sw *statusWriter) WriteHeader(code int) {
	sw.status = code
	sw.ResponseWriter.WriteHeader(code)
}

func (sw *statusWriter) Write(b []byte) (int, error) {
	if sw.status == 0 {
		sw.status = 200
	}
	return sw.ResponseWriter.Write(b)
}

// ── Live reload ───────────────────────────────────────────────────────────────

var (
	lrClients   = make(map[chan struct{}]struct{})
	lrClientsMu sync.Mutex
)

func lrBroadcast() {
	lrClientsMu.Lock()
	defer lrClientsMu.Unlock()
	for ch := range lrClients {
		select {
		case ch <- struct{}{}:
		default:
		}
	}
}

func lrSSEHandler(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "SSE no soportado", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	flusher.Flush()

	ch := make(chan struct{}, 1)
	lrClientsMu.Lock()
	lrClients[ch] = struct{}{}
	lrClientsMu.Unlock()
	defer func() {
		lrClientsMu.Lock()
		delete(lrClients, ch)
		lrClientsMu.Unlock()
	}()

	for {
		select {
		case <-ch:
			fmt.Fprintf(w, "data: reload\n\n")
			flusher.Flush()
		case <-r.Context().Done():
			return
		}
	}
}

const lrScript = `<script>
  (function(){
    var es = new EventSource('/--livereload');
    es.onmessage = function(){ location.reload(); };
    es.onerror   = function(){ es.close(); };
  })();
</script>`

var watchSkip = map[string]bool{".git": true, "tools": true}

func watchFiles(root string) {
	collect := func() map[string]time.Time {
		m := map[string]time.Time{}
		filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return nil
			}
			if info.IsDir() {
				if watchSkip[info.Name()] {
					return filepath.SkipDir
				}
				return nil
			}
			ext := filepath.Ext(path)
			if ext == ".js" || ext == ".html" || ext == ".css" {
				m[path] = info.ModTime()
			}
			return nil
		})
		return m
	}

	snapshot := collect()

	for range time.Tick(500 * time.Millisecond) {
		current := collect()
		for path, mod := range current {
			if prev, ok := snapshot[path]; !ok || mod != prev {
				rel, _ := filepath.Rel(root, path)
				fmt.Printf("  ~ %s\n", rel)
				snapshot = current
				lrBroadcast()
				break
			}
		}
	}
}

// ── Logger middleware ─────────────────────────────────────────────────────────

func colorStatus(s int) string {
	switch {
	case s >= 500:
		return fmt.Sprintf("\033[31m%d\033[0m", s) // rojo
	case s >= 400:
		return fmt.Sprintf("\033[33m%d\033[0m", s) // amarillo
	default:
		return fmt.Sprintf("\033[32m%d\033[0m", s) // verde
	}
}

func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/--livereload" {
			next.ServeHTTP(w, r)
			return
		}
		start := time.Now()
		sw := &statusWriter{ResponseWriter: w, status: 200}
		next.ServeHTTP(sw, r)
		fmt.Printf("  %-6s %-45s %s  %v\n",
			r.Method, r.URL.Path, colorStatus(sw.status), time.Since(start).Round(time.Millisecond))
	})
}

// ── Helpers ───────────────────────────────────────────────────────────────────

func getLocalIP() string {
	addrs, _ := net.InterfaceAddrs()
	for _, addr := range addrs {
		if ipnet, ok := addr.(*net.IPNet); ok && !ipnet.IP.IsLoopback() && ipnet.IP.To4() != nil {
			return ipnet.IP.String()
		}
	}
	return ""
}

func openBrowser(u string) {
	var cmd string
	var args []string
	switch runtime.GOOS {
	case "windows":
		cmd = "rundll32"
		args = []string{"url.dll,FileProtocolHandler", u}
	case "darwin":
		cmd = "open"
		args = []string{u}
	default:
		cmd = "xdg-open"
		args = []string{u}
	}
	exec.Command(cmd, args...).Start()
}

func serveWithLiveReload(w http.ResponseWriter, path string) {
	content, err := os.ReadFile(path)
	if err != nil {
		http.Error(w, "archivo no encontrado", http.StatusNotFound)
		return
	}
	html := strings.Replace(string(content), "</body>", lrScript+"\n</body>", 1)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	io.WriteString(w, html)
}

func parseProxy(rule string) (prefix, target string, ok bool) {
	for _, scheme := range []string{":https://", ":http://"} {
		if idx := strings.Index(rule, scheme); idx >= 0 {
			return rule[:idx], rule[idx+1:], true
		}
	}
	return "", "", false
}

// ── Main ──────────────────────────────────────────────────────────────────────

func main() {
	var proxies proxyFlags
	port     := flag.String("port", "", "Puerto del servidor")
	testMode := flag.Bool("test", false, "Sirve tests/tests.html en lugar de index.html")
	flag.Var(&proxies, "proxy", "Proxy de API: /prefix:http://host:port (repetible)")
	flag.Parse()

	if *port == "" {
		if *testMode {
			*port = "8081"
		} else {
			*port = "8080"
		}
	}

	// Verificar que el puerto esté libre
	ln, err := net.Listen("tcp", ":"+*port)
	if err != nil {
		fmt.Printf("❌ Puerto %s en uso. Probá con -port=<otro>\n", *port)
		os.Exit(1)
	}
	ln.Close()

	exePath, _ := os.Executable()
	repoRoot := filepath.Dir(filepath.Dir(filepath.Dir(exePath)))

	mux := http.NewServeMux()

	// Live reload SSE
	mux.HandleFunc("/--livereload", lrSSEHandler)
	go watchFiles(repoRoot)

	// Proxies de API
	for _, rule := range proxies {
		prefix, target, ok := parseProxy(rule)
		if !ok {
			fmt.Printf("⚠️  proxy inválido (formato: /prefix:http://host:port): %s\n", rule)
			continue
		}
		targetURL, err := url.Parse(target)
		if err != nil {
			fmt.Printf("⚠️  URL inválida: %s\n", target)
			continue
		}
		rp := httputil.NewSingleHostReverseProxy(targetURL)
		// Registrar con y sin trailing slash para evitar redirecciones 301 en POST
		mux.HandleFunc(prefix, rp.ServeHTTP)
		mux.HandleFunc(prefix+"/", rp.ServeHTTP)
	}

	// Favicon
	mux.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		favicon := filepath.Join(repoRoot, "public", "assets", "favicon.ico")
		if _, err := os.Stat(favicon); err == nil {
			http.ServeFile(w, r, favicon)
			return
		}
		http.NotFound(w, r)
	})

	// Handler principal
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			if *testMode {
				f := filepath.Join(repoRoot, "tests", "tests.html")
				if _, err := os.Stat(f); err == nil {
					serveWithLiveReload(w, f)
					return
				}
				http.Error(w, "tests/tests.html no encontrado", http.StatusNotFound)
				return
			}
			serveWithLiveReload(w, filepath.Join(repoRoot, "index.html"))
			return
		}
		http.FileServer(http.Dir(repoRoot)).ServeHTTP(w, r)
	})

	// Info de inicio
	localURL := "http://localhost:" + *port
	localIP  := getLocalIP()
	fmt.Println()
	if *testMode {
		fmt.Println("  capyfront-server  [modo test]")
	} else {
		fmt.Println("  capyfront-server")
	}
	fmt.Printf("  Local    →  %s\n", localURL)
	if localIP != "" {
		fmt.Printf("  Network  →  http://%s:%s\n", localIP, *port)
	}
	fmt.Println("  Live reload activado (.js .html .css)")
	if len(proxies) > 0 {
		for _, rule := range proxies {
			prefix, target, ok := parseProxy(rule)
			if ok {
				fmt.Printf("  proxy    →  %-20s  →  %s\n", prefix, target)
			}
		}
	}
	fmt.Println()

	go func() {
		time.Sleep(500 * time.Millisecond)
		openBrowser(localURL)
	}()

	if err := http.ListenAndServe(":"+*port, logMiddleware(mux)); err != nil {
		fmt.Println("❌ Error:", err)
	}
}
