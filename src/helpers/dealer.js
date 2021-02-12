import Card from './card'

export default class Shop {
  constructor(scene) {
  }

  renderShop (cards) {
    for (let i = 0; i < cards.length; i++) {
      let playerCard = new Card(scene);
      playerCard.render(430 + i * 100, 650, cards[i]);
    }
  }
}