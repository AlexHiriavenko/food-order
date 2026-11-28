import { addProductToCart } from "../cart/cart-storage";
import {
  formatPrice,
  getProductPrice,
} from "../product/product-price";
import type { Product } from "../product/product.types";

const baseUrl = import.meta.env.BASE_URL;

function openQuantityModal(product: Product, trigger: HTMLButtonElement): void {
  document.querySelector(".product-modal")?.remove();

  let quantity = 1;
  const titleId = `product-modal-title-${product.id}`;

  const modal = document.createElement("div");
  modal.className = "product-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", titleId);

  const content = document.createElement("div");
  content.className = "product-modal__content";

  const closeButton = document.createElement("button");
  closeButton.className = "product-modal__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Закрыть");
  closeButton.textContent = "×";

  const title = document.createElement("h2");
  title.className = "product-modal__title";
  title.id = titleId;
  title.textContent = product.name;

  const label = document.createElement("p");
  label.className = "product-modal__label";
  label.textContent = "Количество";

  const counter = document.createElement("div");
  counter.className = "product-modal__counter";

  const decreaseButton = document.createElement("button");
  decreaseButton.className = "product-modal__counter-button";
  decreaseButton.type = "button";
  decreaseButton.setAttribute("aria-label", "Уменьшить количество");
  decreaseButton.textContent = "−";
  decreaseButton.disabled = true;

  const quantityValue = document.createElement("span");
  quantityValue.className = "product-modal__quantity";
  quantityValue.setAttribute("aria-live", "polite");
  quantityValue.textContent = String(quantity);

  const increaseButton = document.createElement("button");
  increaseButton.className = "product-modal__counter-button";
  increaseButton.type = "button";
  increaseButton.setAttribute("aria-label", "Увеличить количество");
  increaseButton.textContent = "+";

  const confirmButton = document.createElement("button");
  confirmButton.className = "product-modal__add-button";
  confirmButton.type = "button";
  confirmButton.textContent = "Добавить";

  const updateQuantity = (value: number): void => {
    quantity = Math.max(1, value);
    quantityValue.textContent = String(quantity);
    decreaseButton.disabled = quantity === 1;
  };

  decreaseButton.addEventListener("click", () => updateQuantity(quantity - 1));
  increaseButton.addEventListener("click", () => updateQuantity(quantity + 1));

  const closeModal = (): void => {
    modal.remove();
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", handleKeydown);
    trigger.focus();
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") closeModal();
  };

  closeButton.addEventListener("click", closeModal);
  confirmButton.addEventListener("click", () => {
    addProductToCart(product.id, quantity);
    closeModal();
  });
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", handleKeydown);

  counter.append(decreaseButton, quantityValue, increaseButton);
  content.append(closeButton, title, label, counter, confirmButton);
  modal.append(content);
  document.body.append(modal);
  document.body.classList.add("modal-open");
  closeButton.focus();
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
    currentPrice.textContent = `Цена: ${formatPrice(getProductPrice(product))}`;

    const oldPrice = document.createElement("del");
    oldPrice.className = "product-card__old-price";
    oldPrice.textContent = formatPrice(product.price);

    const discount = document.createElement("span");
    discount.className = "product-card__discount";
    discount.textContent = `−${product.discount}%`;

    priceRow.append(currentPrice, oldPrice, discount);
  } else {
    currentPrice.textContent = `Цена: ${formatPrice(product.price)}`;
    priceRow.append(currentPrice);
  }

  const addButton = document.createElement("button");
  addButton.className = "product-card__add-button";
  addButton.type = "button";
  addButton.textContent = "Добавить в корзину";
  addButton.addEventListener("click", () => openQuantityModal(product, addButton));

  content.append(name, description, priceRow, addButton);
  item.append(image, content);

  return item;
}
