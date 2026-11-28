# food-order

Food Order — многостраничное веб-приложение для просмотра меню ресторана и формирования заказа. Пользователь может выбирать блюда по категориям, добавлять их в корзину, менять количество позиций и просматривать актуальные акции. Корзина сохраняется между сеансами в локальном хранилище браузера.

## Деплой

[https://alexhiriavenko.github.io/food-order/](https://alexhiriavenko.github.io/food-order/)

## Скрипты

- `npm run dev` — dev-сервер
- `npm run typecheck` — проверка типов (`tsc --noEmit`)
- `npm run build` — проверка типов + сборка в `dist/`
- `npm run deploy` — сборка и публикация в gh-pages

## Husky

Pre-commit хук запускает `npm run typecheck`. Если TS-сборка падает с ошибками — коммит блокируется.
