import Card from "./card";

export default class Deck {
  allCards = ["AS", "AH", "AD", "AC", "2S", "2H", "2D", "2C"];
  cards = [];

  constructor(allCards = false) {
    // if (existingCards) {

    // } else if (allCards) {
      this.cards = this.shuffle(this.allCards)
    // }
  }

  insertCard = (card) => {
    return this.cards.push(card);
  };

  drawCard = () => {
    const card_position = Math.floor(Math.random() * this.cards.length);
    const card = this.cards[card_position];

    this.cards = this.cards.filter((x) => x !== card);
    return card;
  };

  shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  // _pluck(array, key) {
  //   return array.map(o => o[key]);
  // }
}
