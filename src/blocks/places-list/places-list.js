import { Card } from "../place-card/place-card";
import { api } from "../../index";

class Cardlist {
  constructor(container) {
    this.container = container;
    api
      .getInitialCards()
      .then(cards => this.render(cards))
      .catch(err => {
        console.log(err);
      });
  }

  render(cards) {
    for (let i = 0; i < cards.length; i += 1) {
      const { cardElement } = new Card(cards[i].name, cards[i].link);
      this.container.appendChild(cardElement);
    }
  }

  addCard(name, link) {
    const { cardElement } = new Card(name, link);
    this.container.appendChild(cardElement);
  }
}
export { Cardlist };
