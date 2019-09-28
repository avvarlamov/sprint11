import { Popup } from "../blocks/popup/popup";
import { btnInactive } from "../index";

class AddCardPopup extends Popup {
  constructor(popupElement, closeButton) {
    super(popupElement, closeButton);
  }

  open() {
    super.open();
    this.clearCardForm();
    this.clearCardFormErrorMessages();
    this.disactiveCardButton();
  }

  clearCardForm() {
    const form = document.forms.new;
    form.reset();
  }

  clearCardFormErrorMessages() {
    document.querySelector("#error-place").textContent = "";
    document.querySelector("#error-link").textContent = "";
  }

  disactiveCardButton() {
    const form = document.forms.new;
    const btn = form.querySelector("#card-button");
    btnInactive(btn);
  }
}

export { AddCardPopup };
