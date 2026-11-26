import "./styles/style.scss";
import "./components/menu/menu.scss";
import { initHeaderMenu } from "./components/shared/header/header";
import { renderMenu } from "./components/menu/menu";

console.info("edOK started");
initHeaderMenu();
void renderMenu();
