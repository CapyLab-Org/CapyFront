export async function actionExample() {
  const res = await apiRequest('/api/products');
  return res.json();
}