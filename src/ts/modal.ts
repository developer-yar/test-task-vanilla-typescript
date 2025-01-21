export const modal = (): void => {
  const modal: HTMLElement | null = document.getElementById("modal");

  const modalOpenButton: HTMLElement | null =
    document.getElementById("modal-open-button");
  modalOpenButton?.addEventListener("click", () => {
    modal?.classList.add("modal_opened");
    document.body.style.overflow = "hidden";
  });

  const modalCloseButton: HTMLElement | null =
    document.getElementById("modal-close-button");
  modalCloseButton?.addEventListener("click", () => {
    modal?.classList.remove("modal_opened");
    document.body.removeAttribute("style");
  });
};
