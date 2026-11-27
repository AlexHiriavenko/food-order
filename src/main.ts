import "./styles/style.scss";
import "./components/menu/menu.scss";
import { initHeaderMenu } from "./components/shared/header/header";
import { renderHomeProducts } from "./components/home/products/products";
import { renderMenu } from "./components/menu/menu";


initHeaderMenu();
void renderMenu();
void renderHomeProducts();
