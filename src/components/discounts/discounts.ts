import { createProductCard } from "../shared/product-card/product-card";
import type { Product } from "../shared/product/product.types";

const baseUrl = import.meta.env.BASE_URL;

export async function renderDiscounts(): Promise<void> {
  const grid = document.querySelector<HTMLUListElement>(".discounts__grid");
  const status = document.querySelector<HTMLParagraphElement>(
    ".discounts__status",
  );

  if (!grid || !status) return;

  try {
    const response = await fetch(`${baseUrl}products.json`);

    if (!response.ok) {
      throw new Error(`Не удалось загрузить products.json: ${response.status}`);
    }

    const products = (await response.json()) as Product[];
    const discountedProducts = products.filter((product) => product.discount);

    if (discountedProducts.length === 0) {
      status.textContent = "Товаров со скидкой пока нет.";
      return;
    }

    grid.replaceChildren(...discountedProducts.map(createProductCard));
    status.remove();
  } catch (error) {
    status.textContent = "Не удалось загрузить скидки. Обновите страницу.";
    console.error(error);
  }
}
