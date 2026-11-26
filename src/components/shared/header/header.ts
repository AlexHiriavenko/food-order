export function initHeaderMenu(): void {
  const header = document.querySelector<HTMLElement>(".header");
  const toggle = header?.querySelector<HTMLButtonElement>(".header__toggle");

  if (!header || !toggle) return;

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
