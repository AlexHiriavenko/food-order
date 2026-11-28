import {
  createProductCard,
  type Product,
} from "../shared/product-card/product-card";

interface Category {
  slug: string;
  name: string;
  image: string;
}

const baseUrl = import.meta.env.BASE_URL;
const menuUrl = `${baseUrl}menu/`;

async function loadData<T>(fileName: string): Promise<T> {
  const response = await fetch(`${baseUrl}${fileName}`);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить ${fileName}: ${response.status}`);
  }

  return response.json();
}

function createImage(path: string): HTMLImageElement {
  const image = document.createElement("img");
  image.src = `${baseUrl}${path}`;
  image.alt = "";
  image.width = 160;
  return image;
}

function createCategoryCard(category: Category): HTMLLIElement {
  const item = document.createElement("li");
  item.className = "menu__category";

  const link = document.createElement("a");
  link.href = `${menuUrl}?category=${encodeURIComponent(category.slug)}`;

  const image = createImage(category.image);
  image.className = "menu__category-image";

  const name = document.createElement("span");
  name.className = "menu__category-name";
  name.textContent = category.name;

  link.append(image, name);
  item.append(link);

  return item;
}

export async function renderMenu(): Promise<void> {
  const title = document.querySelector<HTMLHeadingElement>("#menu-title");
  const list = document.querySelector<HTMLUListElement>(".menu__categories");
  const status = document.querySelector<HTMLParagraphElement>(".menu__status");

  if (!title || !list || !status) return;

  const selectedSlug = new URLSearchParams(window.location.search).get(
    "category",
  );

  try {
    const categories = await loadData<Category[]>("categories.json");

    if (!selectedSlug) {
      if (categories.length === 0) {
        status.textContent = "Категорий пока нет.";
        return;
      }

      list.replaceChildren(...categories.map(createCategoryCard));
      status.remove();
      return;
    }

    const category = categories.find((item) => item.slug === selectedSlug);

    const backLink = document.createElement("a");
    backLink.href = menuUrl;
    backLink.textContent = "Все категории";
    title.after(backLink);

    if (!category) {
      status.textContent = "Категория не найдена.";
      return;
    }

    title.textContent = category.name;
    list.setAttribute("aria-label", `Блюда: ${category.name}`);
    status.textContent = "Загружаем блюда…";

    const products = await loadData<Product[]>("products.json");
    const matchingProducts = products.filter(
      (product) => product.category === category.slug,
    );

    if (matchingProducts.length === 0) {
      status.textContent = "В этой категории пока нет блюд.";
      return;
    }

    list.replaceChildren(...matchingProducts.map(createProductCard));
    status.remove();
  } catch (error) {
    status.textContent = "Не удалось загрузить меню. Обнови страницу.";
    console.error(error);
  }
}
