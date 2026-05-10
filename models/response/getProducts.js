/**
 * @license MIT
 * Copyright (c) 2025 CapyLab Studio
 */

const MOCK_PRODUCTS = [
  { id: '1', name: 'Capy Plush',    price: '29.99', emoji: '🧸', stock: '12', desc: 'El capibara de peluche más suave del mundo.' },
  { id: '2', name: 'Capy T-Shirt',  price: '19.99', emoji: '👕', stock: '5',  desc: 'Camiseta con bordado capibara en algodón orgánico.' },
  { id: '3', name: 'Capy Mug',      price: '14.99', emoji: '☕', stock: '20', desc: 'Mug de cerámica resistente al calor, 350 ml.' },
  { id: '4', name: 'Sticker Pack',  price: '7.99',  emoji: '🎨', stock: '50', desc: 'Pack de 10 stickers capibara resistentes al agua.' },
];

export async function getProducts() {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_PRODUCTS;
}
