export default class PlayerHand {
  constructor(cards) {
    console.log(cards)
    this.cards = [...cards];

    const numCards = cards.length;
    const angleRange = Math.min(40, numCards * 10)
    const minAngle = 0 - (angleRange / 2);

    const circle = new Phaser.Geom.Circle(640, 800, 300)

    this.cards.forEach((card, i) => {
      const offset = i / (numCards - 1)
      card.angle = minAngle + (angleRange * offset);

      this.setPlayerHandVisibility(card, i)
      const radians = ((card.angle - 90) * Math.PI / 180)
      card.y = circle.y + circle.radius * Math.sin(radians)
      card.x = circle.x + circle.radius * Math.cos(radians)
      console.log(i)
      console.log(circle.x, circle.y);
      console.log(card.x, card.y);
    });
  }

  setPlayerHandVisibility = (card, index) => {
    card.x = 400 + index * 100;
    card.y = 600;
    card.visible = true;
    card.setDepth(index);
  }

  contains = (card) => {
    return this.cards.includes(card);
  }
}
