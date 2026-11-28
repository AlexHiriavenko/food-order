export interface CartItem {
  productId: number;
  quantity: number;
}

export const CART_UPDATED_EVENT = "cart:updated";

const CART_STORAGE_KEY = "cart";

export function getCart(): CartItem[] {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) return [];

  try {
    const cart: unknown = JSON.parse(savedCart);
    return Array.isArray(cart) ? (cart as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function addProductToCart(productId: number, quantity: number): void {
  const cart = getCart();
  const cartItem = cart.find((item) => item.productId === productId);

  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveCart(cart);
}

export function updateCartItemQuantity(
  productId: number,
  quantity: number,
): void {
  const cart = getCart();
  const cartItem = cart.find((item) => item.productId === productId);

  if (!cartItem) return;

  cartItem.quantity = Math.max(1, quantity);
  saveCart(cart);
}

export function removeProductFromCart(productId: number): void {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
}

export function getCartItemsCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}
