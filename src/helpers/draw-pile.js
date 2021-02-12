import cardData from "../assets/cards/star-realms-base.json";

export default class DrawPile {
  cards = [];

  constructor(scene) {
    cardData.forEach((data) => {
      if (data.faction === "Unaligned") {
        return;
      }

      const classFile = data.name.toLowerCase().split(" ").join("-");
      const Klass = require(`../sprites/cards/${classFile}`).default;

      console.log(data.count);
      console.log(Array.from(data.count));
      Array.from({ length: data.count }).forEach((_i) => {
        this.cards.push(
          new Klass({
            scene,
            x: 0,
            y: 0,
          })
        );
      });
    });

    this.shuffle();

    console.log(this.cards);
  }

  shuffle = () => {
    const cards = [
      ...this.cards,
    ]
    const shuffledCards = []

    while (cards.length !== 0) {
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * cards.length);

      shuffledCards.push(cards[randomIndex])
      cards.splice(randomIndex, 1)
    }

    this.cards = shuffledCards;
  }
}
