interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number | null;
  image: string;
}

const PRODUCTS_PER_PAGE = 6;
const baseUrl = import.meta.env.BASE_URL;

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(price);
}

function createProductCard(product: Product): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "home-products__card";

  const image = document.createElement("img");
  image.className = "home-products__image";
  image.src = `${baseUrl}${product.image}`;
  image.alt = product.name;
  image.loading = "lazy";
  image.width = 420;
  image.height = 260;

  const content = document.createElement("div");
  content.className = "home-products__content";

  const name = document.createElement("h3");
  name.className = "home-products__name";
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "home-products__description";
  description.textContent = product.description;

  const priceRow = document.createElement("div");
  priceRow.className = "home-products__price-row";

  const currentPrice = document.createElement("strong");
  currentPrice.className = "home-products__price";

  if (product.discount) {
    const discountedPrice = product.price * (1 - product.discount / 100);
    currentPrice.textContent = formatPrice(discountedPrice);

    const oldPrice = document.createElement("del");
    oldPrice.className = "home-products__old-price";
    oldPrice.textContent = formatPrice(product.price);

    const discount = document.createElement("span");
    discount.className = "home-products__discount";
    discount.textContent = `−${product.discount}%`;

    priceRow.append(currentPrice, oldPrice, discount);
  } else {
    currentPrice.textContent = formatPrice(product.price);
    priceRow.append(currentPrice);
  }

  content.append(name, description, priceRow);
  item.append(image, content);

  return item;
}

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
  onSelect: (page: number) => void,
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

  link.addEventListener("click", (event) => {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (page !== currentPage) onSelect(page);
  });

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
    let currentPage = getPageFromUrl(totalPages);

    const renderPage = (page: number): void => {
      currentPage = page;
      const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const pageProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

      grid.replaceChildren(...pageProducts.map(createProductCard));
      pagination.replaceChildren(
        ...Array.from({ length: totalPages }, (_, index) =>
          createPageLink(index + 1, currentPage, selectPage),
        ),
      );
    };

    const selectPage = (page: number): void => {
      window.history.pushState({}, "", getPageUrl(page));
      renderPage(page);
    };

    status.remove();
    pagination.hidden = totalPages <= 1;
    renderPage(currentPage);

    window.addEventListener("popstate", () => {
      renderPage(getPageFromUrl(totalPages));
    });
  } catch (error) {
    status.textContent = "Не удалось загрузить меню. Обновите страницу.";
    console.error(error);
  }
}
