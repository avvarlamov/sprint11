import "./style.css";

import { Api } from "./js/api";
import { Cardlist } from "./blocks/places-list/places-list";
import { UserName } from "./blocks/profile/profile";
import { ProfileEditPopup } from "./blocks/popup-edit/popup-edit";
import { AddCardPopup } from "./js/AddCardPopup";

const serverUrl =
  NODE_ENV === "development"
    ? "http://praktikum.tk/cohort2"
    : "https://praktikum.tk/cohort2";

// Объявление переменных
export const root = document.querySelector(".root");
const placesList = root.querySelector(".places-list");
const addButton = root.querySelector(".user-info__button");
const editButton = root.querySelector(".user-info__edit-button");
const closeX = root.querySelector(".popup__close");
const closeEditForm = root.querySelector(".popup-edit__close");
const popupAddCard = root.querySelector(".popup");
const popupEdit = root.querySelector(".popup-edit");

export const api = new Api({
  baseUrl: serverUrl,
  headers: {
    authorization: "0da67945-8269-4573-bcab-1871b86b8b26",
    "Content-Type": "application/json"
  }
});

let cardlist = new Cardlist(placesList);
let userName = new UserName();

document.forms.new.addEventListener("submit", function(event) {
  event.preventDefault();

  const form = document.forms.new;
  const name = form.elements.name;
  const link = form.elements.link;

  cardlist.addCard(name.value, link.value);
  form.reset();
  popupAddCard.classList.remove("popup_is-opened");
});

let profileEditPopup = new ProfileEditPopup(popupEdit, closeEditForm);
let addCardPopup = new AddCardPopup(popupAddCard, closeX);

// Открытие формы Новое место

addButton.addEventListener("click", function() {
  addCardPopup.open();
});

// Открытие формы Редактирование профиля

editButton.addEventListener("click", function() {
  profileEditPopup.open();
});

// Редактирование профиля
document.forms.editForm.addEventListener("submit", function() {
  profileEditPopup.redact(event);
  profileEditPopup.close();
});

// Активная/неактивная кнопка для форм

export const btnActive = btn => {
  btn.style.backgroundColor = "#000000";
  btn.style.color = "#ffffff";
  btn.disabled = false;
  btn.style.cursor = "pointer";
};
export const btnInactive = btn => {
  btn.style.backgroundColor = "#ffffff";
  btn.style.color = "rgba(0, 0, 0, 0.2)";
  btn.disabled = true;
  btn.style.cursor = "auto";
};

const checkButtonEdit = (name, link, btn) => {
  name.addEventListener("input", () => {
    if (link.value.length > 1 && name.value.length > 1) {
      btnActive(btn);
    } else {
      btnInactive(btn);
    }
  });

  link.addEventListener("input", () => {
    if (name.value.length > 1 && link.value.length > 1) {
      btnActive(btn);
    } else {
      btnInactive(btn);
    }
  });
};

const colorFormEdit = () => {
  const form = document.forms.editForm;
  const name = form.elements.name;
  const link = form.elements.about;
  const button = form.querySelector("#edit-button");

  checkButtonEdit(name, link, button);
};

colorFormEdit();

// Валидация формы редактирования профиля

function checkValidForm(element, errorMesssage) {
  element.addEventListener("input", () => {
    if (element.value.length === 0) {
      errorMesssage.textContent = "Это обязательное поле";
    } else if (element.validity.tooShort) {
      errorMesssage.textContent = "Должно быть от 2 до 30 символов";
    } else {
      errorMesssage.textContent = "";
    }
  });
}

const checkValidName = () => {
  const form = document.forms.editForm;
  const name = form.elements.name;
  const error = document.querySelector("#error-name");

  checkValidForm(name, error);
};

const checkValidAbout = () => {
  const form = document.forms.editForm;
  const about = form.elements.about;
  const error = document.querySelector("#error-about");

  checkValidForm(about, error);
};

const checkEditForm = () => {
  checkValidName();
  checkValidAbout();
};

checkEditForm();

// Валидация формы добавления карточки (поле "Название")

checkValidPlaceName();

function checkValidPlaceName() {
  const form = document.forms.new;
  const name = form.elements.name;
  const error = document.querySelector("#error-place");

  checkValidForm(name, error);
}

// Валидация формы добавления карточки (поле "Ссылка на картинку")

checkValidPlaceUrl();

function checkValidPlaceUrl() {
  const form = document.forms.new;
  const link = form.elements.link;
  const error = document.querySelector("#error-link");

  checkValidUrl(link, error);
}

function checkValidUrl(element, errorMesssage) {
  element.addEventListener("input", () => {
    if (element.validity.typeMismatch) {
      errorMesssage.textContent = "Здесь должна быть ссылка";
    } else {
      errorMesssage.textContent = "";
    }
  });
}

//Активная/неактивная кнопка добавления карточки

const colorFormCard = () => {
  const form = document.forms.new;
  const name = form.elements.name;
  const link = form.elements.link;
  const button = form.querySelector("#card-button");

  checkButtonCard(name, link, button);
};

function checkButtonCard(name, link, btn) {
  name.addEventListener("input", () => {
    if (
      name.value.length > 1 &&
      link.value.length > 0 &&
      !link.validity.typeMismatch
    ) {
      btnActive(btn);
    } else {
      btnInactive(btn);
    }
  });

  link.addEventListener("input", () => {
    if (
      name.value.length > 1 &&
      link.value.length > 0 &&
      !link.validity.typeMismatch
    ) {
      btnActive(btn);
    } else {
      btnInactive(btn);
    }
  });
}

colorFormCard();
