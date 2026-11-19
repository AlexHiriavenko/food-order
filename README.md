# food-order

Облегчённая копия [Restaurant-Vue](https://alexhiriavenko.github.io/Restaurant-Vue/) на TypeScript без фреймворков (Vite + Handlebars partials + SCSS, MPA).

## Скрипты

- `npm run dev` — dev-сервер
- `npm run typecheck` — проверка типов (`tsc --noEmit`)
- `npm run build` — проверка типов + сборка в `dist/`
- `npm run deploy` — сборка и публикация в gh-pages

## Husky

Pre-commit хук запускает `npm run typecheck`. Если TS-сборка падает с ошибками — коммит блокируется.
