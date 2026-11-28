import {
  CART_UPDATED_EVENT,
  getCart,
  removeProductFromCart,
  updateCartItemQuantity,
  type CartItem,
} from "../shared/cart/cart-storage";
import {
  formatPrice,
  getProductPrice,
} from "../shared/product/product-price";
import type { Product } from "../shared/product/product.types";

const baseUrl = import.meta.env.BASE_URL;

function createCartItem(product: Product, cartItem: CartItem): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "cart-item";

  const image = document.createElement("img");
  image.className = "cart-item__image";
  image.src = `${baseUrl}${product.image}`;
  image.alt = product.name;
  image.loading = "lazy";
  image.width = 180;
  image.height = 120;

  const info = document.createElement("div");
  info.className = "cart-item__info";

  const name = document.createElement("h2");
  name.className = "cart-item__name";
  name.textContent = product.name;

  const unitPrice = document.createElement("p");
  unitPrice.className = "cart-item__unit-price";
  const unitPriceLabel = document.createElement("span");
  unitPriceLabel.className = "cart-item__mobile-label";
  unitPriceLabel.textContent = "Цена: ";
  unitPrice.append(unitPriceLabel, formatPrice(getProductPrice(product)));

  info.append(name);

  const controls = document.createElement("div");
  controls.className = "cart-item__controls";

  const decreaseButton = document.createElement("button");
  decreaseButton.className = "cart-item__quantity-button";
  decreaseButton.type = "button";
  decreaseButton.textContent = "−";
  decreaseButton.disabled = cartItem.quantity === 1;
  decreaseButton.setAttribute(
    "aria-label",
    `Уменьшить количество: ${product.name}`,
  );
  decreaseButton.addEventListener("click", () => {
    updateCartItemQuantity(product.id, cartItem.quantity - 1);
  });

  const quantity = document.createElement("span");
  quantity.className = "cart-item__quantity";
  quantity.textContent = String(cartItem.quantity);
  quantity.setAttribute("aria-label", `Количество: ${cartItem.quantity}`);

  const increaseButton = document.createElement("button");
  increaseButton.className = "cart-item__quantity-button";
  increaseButton.type = "button";
  increaseButton.textContent = "+";
  increaseButton.setAttribute(
    "aria-label",
    `Увеличить количество: ${product.name}`,
  );
  increaseButton.addEventListener("click", () => {
    updateCartItemQuantity(product.id, cartItem.quantity + 1);
  });

  controls.append(decreaseButton, quantity, increaseButton);

  const itemTotal = document.createElement("strong");
  itemTotal.className = "cart-item__total";
  const itemTotalLabel = document.createElement("span");
  itemTotalLabel.className = "cart-item__mobile-label";
  itemTotalLabel.textContent = "Стоимость: ";
  itemTotal.append(
    itemTotalLabel,
    formatPrice(getProductPrice(product) * cartItem.quantity),
  );

  const removeButton = document.createElement("button");
  removeButton.className = "cart-item__remove";
  removeButton.type = "button";
  removeButton.textContent = "Удалить";
  removeButton.setAttribute("aria-label", `Удалить из корзины: ${product.name}`);
  removeButton.addEventListener("click", () => {
    removeProductFromCart(product.id);
  });

  item.append(image, info, controls, unitPrice, itemTotal, removeButton);
  return item;
}

export async function renderCart(): Promise<void> {
  const list = document.querySelector<HTMLUListElement>(".cart__list");
  const status = document.querySelector<HTMLParagraphElement>(".cart__status");
  const columns = document.querySelector<HTMLElement>(".cart__columns");
  const summary = document.querySelector<HTMLElement>(".cart__summary");
  const total = document.querySelector<HTMLElement>(".cart__total");

  if (!list || !status || !columns || !summary || !total) return;

  try {
    const response = await fetch(`${baseUrl}products.json`);

    if (!response.ok) {
      throw new Error(`Не удалось загрузить products.json: ${response.status}`);
    }

    const products = (await response.json()) as Product[];

    const updateCart = (): void => {
      const cart = getCart();
      const cartProducts = cart.flatMap((cartItem) => {
        const product = products.find((item) => item.id === cartItem.productId);
        return product ? [{ product, cartItem }] : [];
      });

      if (cartProducts.length === 0) {
        list.replaceChildren();
        status.hidden = false;
        status.textContent = "Корзина пуста.";
        columns.hidden = true;
        summary.hidden = true;
        return;
      }

      list.replaceChildren(
        ...cartProducts.map(({ product, cartItem }) =>
          createCartItem(product, cartItem),
        ),
      );

      const orderTotal = cartProducts.reduce(
        (sum, { product, cartItem }) =>
          sum + getProductPrice(product) * cartItem.quantity,
        0,
      );

      status.hidden = true;
      columns.hidden = false;
      summary.hidden = false;
      total.textContent = formatPrice(orderTotal);
    };

    updateCart();
    window.addEventListener(CART_UPDATED_EVENT, updateCart);
    window.addEventListener("storage", updateCart);
  } catch (error) {
    status.hidden = false;
    status.textContent = "Не удалось загрузить корзину. Обновите страницу.";
    console.error(error);
  }
}
