import { Popup } from "../popup/popup";
import { api } from "../../index";
import { btnInactive } from "../../index";

class ProfileEditPopup extends Popup {
  constructor(popupElement, closeButton) {
    super(popupElement, closeButton);
  }
  open() {
    super.open();
    this.fillInputFields();
    this.disactiveEditButton();
    this.clearEditFormErrorMessages();
  }

  redact(event) {
    event.preventDefault();

    const form = document.forms.editForm;
    const name = form.elements.name;
    const about = form.elements.about;
    const btn = form.querySelector("#edit-button");

    api
      .patchUserName(name.value, about.value)
      .then(data => {
        document.querySelector(".user-info__name").textContent = data.name;
        document.querySelector(".user-info__job").textContent = data.about;
      })
      .catch(err => {
        console.log(err);
      });

    btnInactive(btn);
  }

  fillInputFields() {
    const form = document.forms.editForm;
    const name = form.elements.name;
    const about = form.elements.about;
    name.value = document.querySelector(".user-info__name").textContent;
    about.value = document.querySelector(".user-info__job").textContent;
  }

  disactiveEditButton() {
    const form = document.forms.editForm;
    const btn = form.querySelector("#edit-button");
    btnInactive(btn);
  }

  clearEditFormErrorMessages() {
    document.querySelector("#error-name").textContent = "";
    document.querySelector("#error-about").textContent = "";
  }
}
export { ProfileEditPopup };
