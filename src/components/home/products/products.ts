import { createProductCard } from "../../shared/product-card/product-card";
import type { Product } from "../../shared/product/product.types";

const PRODUCTS_PER_PAGE = 6;
const baseUrl = import.meta.env.BASE_URL;

function getPageFromUrl(totalPages: number): number {
  const page = Number(new URLSearchParams(window.location.search).get("page"));

  if (!Number.isInteger(page) || page < 1) return 1;

  return Math.min(page, totalPages);
}

function getPageUrl(page: number): string {
  const url = new URL(window.location.href);
  url.searchParams.set("page", String(page));
  return url.toString();
}

function createPageLink(
  page: number,
  currentPage: number,
): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = "home-products__page-button";
  link.href = getPageUrl(page);
  link.textContent = String(page);
  link.setAttribute("aria-label", `Страница ${page}`);

  if (page === currentPage) {
    link.classList.add("home-products__page-button--active");
    link.setAttribute("aria-current", "page");
  }

  return link;
}

export async function renderHomeProducts(): Promise<void> {
  const section = document.querySelector<HTMLElement>(".home-products");
  if (!section) return;

  const grid = section.querySelector<HTMLUListElement>(".home-products__grid");
  const status = section.querySelector<HTMLParagraphElement>(".home-products__status");
  const pagination = section.querySelector<HTMLElement>(
    ".home-products__pagination",
  );

  if (!grid || !status || !pagination) return;

  try {
    const response = await fetch(`${baseUrl}products.json`);
    if (!response.ok) {
      throw new Error(`Не удалось загрузить products.json: ${response.status}`);
    }

    const products = (await response.json()) as Product[];

    if (products.length === 0) {
      status.textContent = "В меню пока нет блюд.";
      return;
    }

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const currentPage = getPageFromUrl(totalPages);

    const renderPage = (page: number): void => {
      const start = (page - 1) * PRODUCTS_PER_PAGE;
      const pageProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

      grid.replaceChildren(...pageProducts.map(createProductCard));
      pagination.replaceChildren(
        ...Array.from({ length: totalPages }, (_, index) =>
          createPageLink(index + 1, page),
        ),
      );
    };

    status.remove();
    pagination.hidden = totalPages <= 1;
    renderPage(currentPage);
  } catch (error) {
    status.textContent = "Не удалось загрузить меню. Обновите страницу.";
    console.error(error);
  }
}
