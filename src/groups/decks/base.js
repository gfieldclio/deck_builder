import CardBack from "../../sprites/card-back";

export default class Deck extends Phaser.GameObjects.Group {
  constructor(config) {
    super(config.scene, config.cards);

    this.faceDown = config.faceDown || true;
    if (this.faceDown) {
      this.faceDownCard = new CardBack({
        scene: this.scene,
        x: config.x,
        y: config.y,
      });
      this.add(this.faceDownCard)
    }

    this.shuffle();
    this.render();
  }

  render = () => {
    if (this.faceDown) {
      this.faceDownCard.visible = this.getLength() > 1;
    } else {
      this.children.forEach((card, index) => {
        card.visible = index === 0;
      });
    }
  }
}
