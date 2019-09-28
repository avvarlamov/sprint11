import { root } from "../../index";

class Card {
  constructor(name, link) {
    this.cardElement = this.create(name, link);
    this.openImage = this.openImage.bind(this);
    this.cardElement.addEventListener("click", this.openImage);
  }

  like(event) {
    event.target.classList.toggle("place-card__like-icon_liked");
  }

  remove(event) {
    const card = event.target.closest(".place-card");
    card.parentNode.removeChild(card);

    card
      .querySelector(".place-card__like-icon")
      .removeEventListener("click", this.like);
    card
      .querySelector(".place-card__delete-icon")
      .removeEventListener("click", this.remove);
  }

  create(nameValue, linkValue) {
    const placeContainer = document.createElement("div");
    placeContainer.classList.add("place-card");

    const placeCardImage = document.createElement("div");
    placeCardImage.classList.add("place-card__image");
    placeCardImage.setAttribute("style", `background-image: url(${linkValue})`);

    const placeCardDeleteIcon = document.createElement("button");
    placeCardDeleteIcon.classList.add("place-card__delete-icon");

    placeCardImage.appendChild(placeCardDeleteIcon);

    const placeCardDescription = document.createElement("div");
    placeCardDescription.classList.add("place-card__description");

    const placeCardName = document.createElement("h3");
    placeCardName.classList.add("place-card__name");
    placeCardName.textContent = `${nameValue}`;

    const placeCardLikeIcon = document.createElement("button");
    placeCardLikeIcon.classList.add("place-card__like-icon");

    placeCardDescription.appendChild(placeCardName);
    placeCardDescription.appendChild(placeCardLikeIcon);

    placeContainer.appendChild(placeCardImage);
    placeContainer.appendChild(placeCardDescription);

    placeContainer
      .querySelector(".place-card__like-icon")
      .addEventListener("click", this.like);
    placeContainer
      .querySelector(".place-card__delete-icon")
      .addEventListener("click", this.remove);

    return placeContainer;
  }

  openImage(event) {
    if (event.target.classList.contains("place-card__image")) {
      const popupImage = document.createElement("div");
      popupImage.setAttribute(
        "style",
        `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
      display: flex;
      align-items: center;
      justify-content: center;
      `
      );

      const container = document.createElement("div");
      container.setAttribute(
        "style",
        `
      position: relative;
      `
      );

      const image = document.createElement("img");
      image.setAttribute(
        "src",
        `${event.target.style.backgroundImage.substr(
          5,
          event.target.style.backgroundImage.length - 7
        )}`
      );
      image.setAttribute(
        "style",
        `
      max-width: 80vw;
      max-height: 80vh;
      background-size: contain;
      `
      );

      const closeImage = document.createElement("img");
      closeImage.setAttribute("src", `./images/close.svg`);
      closeImage.setAttribute(
        "style",
        `
      width: 26px;
      position: absolute;
      top: -26px;
      right: -26px;
      cursor: pointer;`
      );

      container.appendChild(image);
      container.appendChild(closeImage);
      popupImage.appendChild(container);
      root.appendChild(popupImage);

      image.addEventListener("click", function() {
        popupImage.parentNode.removeChild(popupImage);
      });

      closeImage.addEventListener("click", function() {
        popupImage.parentNode.removeChild(popupImage);
      });
    }
  }
}
export { Card };
