export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  discount: number | null;
  category: string;
  image: string;
}

const baseUrl = import.meta.env.BASE_URL;

function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(price);
}

export function createProductCard(product: Product): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "product-card";

  const image = document.createElement("img");
  image.className = "product-card__image";
  image.src = `${baseUrl}${product.image}`;
  image.alt = product.name;
  image.loading = "lazy";
  image.width = 420;
  image.height = 260;

  const content = document.createElement("div");
  content.className = "product-card__content";

  const name = document.createElement("h2");
  name.className = "product-card__name";
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-card__description";
  description.textContent = product.description;

  const priceRow = document.createElement("div");
  priceRow.className = "product-card__price-row";

  const currentPrice = document.createElement("strong");
  currentPrice.className = "product-card__price";

  if (product.discount) {
    const discountedPrice = product.price * (1 - product.discount / 100);
    currentPrice.textContent = formatPrice(discountedPrice);

    const oldPrice = document.createElement("del");
    oldPrice.className = "product-card__old-price";
    oldPrice.textContent = formatPrice(product.price);

    const discount = document.createElement("span");
    discount.className = "product-card__discount";
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
