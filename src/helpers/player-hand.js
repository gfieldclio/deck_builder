export default class PlayerHand {
  constructor(cards) {
    console.log(cards)
    this.cards = [...cards];
    this.cards.forEach((card, i) => this.setPlayerHandVisibility(card, i));
  }

  setPlayerHandVisibility = (card, index) => {
    card.x = 400 + index * 100;
    card.y = 600;
    card.visible = true;
  }

  // replaceCard = (oldCard, newCard) => {
  //   const cardIndex = this.cards.indexOf(oldCard);
  //   this.setTradeRowCardVisibility(newCard, cardIndex);
  //   this.cards[cardIndex] = newCard;
  // }

  contains = (card) => {
    return this.cards.includes(card);
  }
}
