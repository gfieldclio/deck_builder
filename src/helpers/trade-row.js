export default class TradeRow {
  constructor(cards) {
    this.cards = [...cards];
    this.cards.forEach((card, i) => this.setTradeRowCardVisibility(card, i));
  }

  setTradeRowCardVisibility = (card, index) => {
    card.x = 430 + index * 150;
    card.y = 300;
    card.visible = true;
  }

  replaceCard = (oldCard, newCard) => {
    const cardIndex = this.cards.indexOf(oldCard);
    this.setTradeRowCardVisibility(newCard, cardIndex);
    this.cards[cardIndex] = newCard;
  }
}
