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

function createPageButton(
  page: number,
  currentPage: number,
  onSelect: (page: number) => void,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "home-products__page-button";
  button.type = "button";
  button.textContent = String(page);
  button.setAttribute("aria-label", `Страница ${page}`);

  if (page === currentPage) {
    button.classList.add("home-products__page-button--active");
    button.setAttribute("aria-current", "page");
    button.disabled = true;
  }

  button.addEventListener("click", () => onSelect(page));
  return button;
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
    let currentPage = 1;

    const renderPage = (page: number): void => {
      currentPage = page;
      const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
      const pageProducts = products.slice(start, start + PRODUCTS_PER_PAGE);

      grid.replaceChildren(...pageProducts.map(createProductCard));
      pagination.replaceChildren(
        ...Array.from({ length: totalPages }, (_, index) =>
          createPageButton(index + 1, currentPage, renderPage),
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
