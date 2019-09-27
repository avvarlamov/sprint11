// Объявление переменных
const root = document.querySelector('.root');
const placesList = root.querySelector('.places-list');
const addButton = root.querySelector('.user-info__button');
const editButton = root.querySelector('.user-info__edit-button');
const closeX = root.querySelector('.popup__close');
const closeEditForm = root.querySelector('.popup-edit__close');
const popupAddCard = root.querySelector('.popup');
const popupEdit = root.querySelector('.popup-edit');



class Card {

  constructor(name, link) {
    this.cardElement = this.create(name, link);
    this.openImage = this.openImage.bind(this);
    this.cardElement.addEventListener('click', this.openImage);
  }

  like(event) {
    event.target.classList.toggle("place-card__like-icon_liked");
  }

  remove(event) {
    const card = event.target.closest(".place-card");
    card.parentNode.removeChild(card);

    card.querySelector(".place-card__like-icon").removeEventListener("click", this.like);
    card.querySelector(".place-card__delete-icon").removeEventListener("click", this.remove);
  }

  create(nameValue, linkValue) {
    const placeContainer = document.createElement('div');
    placeContainer.classList.add('place-card');

    const placeCardImage = document.createElement('div');
    placeCardImage.classList.add('place-card__image');
    placeCardImage.setAttribute('style', `background-image: url(${linkValue})`);

    const placeCardDeleteIcon = document.createElement('button');
    placeCardDeleteIcon.classList.add('place-card__delete-icon');

    placeCardImage.appendChild(placeCardDeleteIcon);

    const placeCardDescription = document.createElement('div');
    placeCardDescription.classList.add('place-card__description');

    const placeCardName = document.createElement('h3');
    placeCardName.classList.add('place-card__name');
    placeCardName.textContent = `${nameValue}`;

    const placeCardLikeIcon = document.createElement('button');
    placeCardLikeIcon.classList.add('place-card__like-icon');

    placeCardDescription.appendChild(placeCardName);
    placeCardDescription.appendChild(placeCardLikeIcon);

    placeContainer.appendChild(placeCardImage);
    placeContainer.appendChild(placeCardDescription);

    placeContainer.querySelector(".place-card__like-icon").addEventListener("click", this.like);
    placeContainer.querySelector(".place-card__delete-icon").addEventListener("click", this.remove);

    return placeContainer;
  }

  openImage(event) {
    if (event.target.classList.contains('place-card__image')) {
      const popupImage = document.createElement('div');
      popupImage.setAttribute('style', `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    `);

      const container = document.createElement('div');
      container.setAttribute('style', `
    position: relative;
    `);


      const image = document.createElement('img');
      image.setAttribute('src', `${event.target.style.backgroundImage.substr(5, event.target.style.backgroundImage.length - 7)}`);
      image.setAttribute('style', `
    max-width: 80vw;
    max-height: 80vh;
    background-size: contain;
    `);

      const closeImage = document.createElement('img');
      closeImage.setAttribute('src', `./images/close.svg`);
      closeImage.setAttribute('style', `
    width: 26px;
    position: absolute;
    top: -26px;
    right: -26px;
    cursor: pointer;`);

      container.appendChild(image);
      container.appendChild(closeImage);
      popupImage.appendChild(container);
      root.appendChild(popupImage);

      image.addEventListener('click', function () {
        popupImage.parentNode.removeChild(popupImage);
      });

      closeImage.addEventListener('click', function () {
        popupImage.parentNode.removeChild(popupImage);
      });
    }
  }
}

class Api {
  constructor({ baseUrl, headers }) {
    this.url = baseUrl;
    this.headers = headers;
  }

  getResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(res.status);
    }
  }

  getInitialCards() {
    return fetch(`${this.url}/cards`, {
      headers: this.headers
    })
      .then(res => {
        return this.getResponse(res)
      })
  }

  getUserName() {
    return fetch(`${this.url}/users/me`, {
      headers: this.headers
    })
      .then(res => {
        return this.getResponse(res)
      });
  }

  patchUserName(nameValue, linkValue) {
    return fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        name: nameValue,
        about: linkValue
    })
    })
      .then(res => {
        return this.getResponse(res)
      });
  }
}

const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort2',
  headers: {
    authorization: '0da67945-8269-4573-bcab-1871b86b8b26',
    'Content-Type': 'application/json'
  }
});

class Cardlist {
  constructor(container) {
    this.container = container;
    api.getInitialCards()
      .then(cards => this.render(cards))
      .catch((err) => {
        console.log(err);
      });
  }

  render(cards) {
    for (let i = 0; i < cards.length; i += 1) {
      const { cardElement } = new Card(cards[i].name, cards[i].link);
      this.container.appendChild(cardElement);
    };
  }

  addCard(name, link) {
    const { cardElement } = new Card(name, link);
    this.container.appendChild(cardElement);
  }

}

let cardlist = new Cardlist(placesList);

class UserName {
  constructor() {
    api.getUserName()
      .then(userData => this.fillUserInfo(userData))
      .catch((err) => {
        console.log(err);
      });
  }

  fillUserInfo(userData) {
    document.querySelector('.user-info__name').textContent = userData.name;
    document.querySelector('.user-info__job').textContent = userData.about;
    document.querySelector('.user-info__photo').style.backgroundImage = `url(${userData.avatar})`;
  }
}

let userName = new UserName;

document.forms.new.addEventListener('submit', function (event) {
  event.preventDefault();

  const form = document.forms.new;
  const name = form.elements.name;
  const link = form.elements.link;

  cardlist.addCard(name.value, link.value);
  form.reset();
  popupAddCard.classList.remove('popup_is-opened');
});


class Popup {
  constructor(popupElement, closeButton) {
    this.element = popupElement;
    this.closeButton = closeButton;
    this.close = this.close.bind(this);
    this.onPopupEscPress = this.onPopupEscPress.bind(this);
    this.closeButton.addEventListener("click", this.close);
    document.querySelector("body").addEventListener("keydown", this.onPopupEscPress);
  }

  open() {
    this.element.classList.add('popup_is-opened');
  }

  close() {
    this.element.classList.remove('popup_is-opened');
  }

  onPopupEscPress(event) {
    const ESC_BUTTON_CODE = 27;
    if (event.keyCode === ESC_BUTTON_CODE) {
      this.close();
    }
  }
}

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
    const btn = form.querySelector('#edit-button');

    api.patchUserName(name.value, about.value)
      .then(data => {
        document.querySelector('.user-info__name').textContent = data.name;
        document.querySelector('.user-info__job').textContent = data.about;
      })
      .catch((err) => {
        console.log(err);
      });

    btnInactive(btn);
  }

  fillInputFields() {
    const form = document.forms.editForm;
    const name = form.elements.name;
    const about = form.elements.about;
    name.value = document.querySelector('.user-info__name').textContent;
    about.value = document.querySelector('.user-info__job').textContent;
  }

  disactiveEditButton() {
    const form = document.forms.editForm;
    const btn = form.querySelector('#edit-button');
    btnInactive(btn);
  }

  clearEditFormErrorMessages() {
    document.querySelector('#error-name').textContent = "";
    document.querySelector('#error-about').textContent = "";
  }
}

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
    document.querySelector('#error-place').textContent = "";
    document.querySelector('#error-link').textContent = "";
  }

  disactiveCardButton() {
    const form = document.forms.new;
    const btn = form.querySelector('#card-button');
    btnInactive(btn);
  }
}


let profileEditPopup = new ProfileEditPopup(popupEdit, closeEditForm);
let addCardPopup = new AddCardPopup(popupAddCard, closeX);


// Открытие формы Новое место

addButton.addEventListener('click', function () {

  addCardPopup.open();
});




// Открытие формы Редактирование профиля

editButton.addEventListener('click', function () {

  profileEditPopup.open();
});

// Редактирование профиля
document.forms.editForm.addEventListener('submit', function () {
  profileEditPopup.redact(event);
  profileEditPopup.close();
});


// Активная/неактивная кнопка для форм

const btnActive = btn => {
  btn.style.backgroundColor = "#000000";
  btn.style.color = "#ffffff";
  btn.disabled = false;
  btn.style.cursor = "pointer";
};
const btnInactive = btn => {
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
  })
}

const checkValidName = () => {
  const form = document.forms.editForm;
  const name = form.elements.name;
  const error = document.querySelector('#error-name');

  checkValidForm(name, error);
}

const checkValidAbout = () => {
  const form = document.forms.editForm;
  const about = form.elements.about;
  const error = document.querySelector('#error-about');

  checkValidForm(about, error);
}

const checkEditForm = () => {
  checkValidName();
  checkValidAbout();
}

checkEditForm();

// Валидация формы добавления карточки (поле "Название")

checkValidPlaceName();

function checkValidPlaceName() {
  const form = document.forms.new;
  const name = form.elements.name;
  const error = document.querySelector('#error-place');

  checkValidForm(name, error);
}

// Валидация формы добавления карточки (поле "Ссылка на картинку")

checkValidPlaceUrl();

function checkValidPlaceUrl() {
  const form = document.forms.new;
  const link = form.elements.link;
  const error = document.querySelector('#error-link');

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
    if (name.value.length > 1 && link.value.length > 0 && (!link.validity.typeMismatch)) {
      btnActive(btn);
    } else {
      btnInactive(btn);
    }
  });


  link.addEventListener("input", () => {
    if (name.value.length > 1 && link.value.length > 0 && (!link.validity.typeMismatch)) {
      btnActive(btn);
    } else {
      btnInactive(btn);
    }
  });

}

colorFormCard();


/*
  Класс Api организован правильно, но в него также следует перенести отправку
  данных пользователя, а не писать её в функции redact.

  Так же при обращении к серверу, обработка ошибок должна быть в конце цепочки
  блоков then, сейчас получилось, что обработка ошибок находится в середине.

*/

/*
  Теперь код выглядит намного лучше, методы класса Api организованы и 
  используются правильно, хорошая работа!
  
  Рекомендую в свободное время доделать и оставшуюся часть задания, чтобы закрепить 
  полученные знания.

*/