import type { Product } from "./product.types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(price);
}

export function getProductPrice(product: Product): number {
  return product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;
}
