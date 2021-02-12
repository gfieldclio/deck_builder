import Card from "./card";

export default class Deck {
  // let cards = ["AS", "AH", "AD", "AC", "2S", "2H", "2D", "2C"];

  constructor(allCards = false) {
    if (allCards) {
      this.cards = ["AS", "AH", "AD", "AC", "2S", "2H", "2D", "2C"];
    } else {
      this.cards = [];
    }
  }

  insertCard(card) {
    return this.cards.push(card);
  }

  drawCard() {
    debugger;
    const card_position = Math.floor(Math.random() * this.cards.length);
    const card = this.cards[card_position]
    
    this.cards = this.cards.filter((x) => x !== card);
    return card;
  }

  // _pluck(array, key) {
  //   return array.map(o => o[key]);
  // }
}
