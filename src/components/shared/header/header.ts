import {
  CART_UPDATED_EVENT,
  getCartItemsCount,
} from "../cart/cart-storage";

export function initHeaderMenu(): void {
  const header = document.querySelector<HTMLElement>(".header");
  const toggle = header?.querySelector<HTMLButtonElement>(".header__toggle");
  const cartLink = header?.querySelector<HTMLAnchorElement>(".header__cart");
  const cartCount = cartLink?.querySelector<HTMLElement>(
    ".header__cart-count",
  );

  if (!header || !toggle) return;

  const updateCartCount = (): void => {
    if (!cartLink || !cartCount) return;

    const count = getCartItemsCount();
    cartCount.textContent = String(count);
    cartCount.hidden = count === 0;
    cartLink.setAttribute(
      "aria-label",
      count === 0 ? "Корзина" : `Корзина, товаров: ${count}`,
    );
  };

  updateCartCount();
  window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
  window.addEventListener("storage", updateCartCount);

  toggle.hidden = false;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  header.addEventListener("keydown", (event) => {
    if (
      event.key !== "Escape" ||
      toggle.getAttribute("aria-expanded") !== "true" ||
      toggle.getClientRects().length === 0
    ) {
      return;
    }

    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  });
}
