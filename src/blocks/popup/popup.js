class Popup {
  constructor(popupElement, closeButton) {
    this.element = popupElement;
    this.closeButton = closeButton;
    this.close = this.close.bind(this);
    this.onPopupEscPress = this.onPopupEscPress.bind(this);
    this.closeButton.addEventListener("click", this.close);
    document
      .querySelector("body")
      .addEventListener("keydown", this.onPopupEscPress);
  }

  open() {
    this.element.classList.add("popup_is-opened");
  }

  close() {
    this.element.classList.remove("popup_is-opened");
  }

  onPopupEscPress(event) {
    const ESC_BUTTON_CODE = 27;
    if (event.keyCode === ESC_BUTTON_CODE) {
      this.close();
    }
  }
}

export { Popup };
