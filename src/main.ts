import "./styles/style.scss";
import "./components/menu/menu.scss";
import { initHeaderMenu } from "./components/shared/header/header";
import { renderCart } from "./components/cart/cart";
import { renderDiscounts } from "./components/discounts/discounts";
import { renderHomeProducts } from "./components/home/products/products";
import { renderMenu } from "./components/menu/menu";


initHeaderMenu();
void renderHomeProducts();
void renderMenu();
void renderDiscounts();
void renderCart();
