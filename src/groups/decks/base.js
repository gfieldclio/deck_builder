import CardBack from "../../sprites/card-back";

export default class Deck extends Phaser.GameObjects.Group {
  constructor(config) {
    super(config.scene, config.cards);

    this.empty = this.scene.add.graphics();
    this.empty.lineStyle(4, 0xff69b4);
    const width = 409 * 0.35;
    const height = 568 * 0.35;
    this.empty.strokeRect(
      config.x - width / 2,
      config.y - height / 2,
      width,
      height
    );
    this.add(this.empty);

    this.faceDown =
      config.faceDown === null || config.faceDown === undefined
        ? true
        : config.faceDown;
    if (this.faceDown) {
      this.faceDownCard = new CardBack({
        scene: this.scene,
        x: config.x,
        y: config.y,
      });
      this.add(this.faceDownCard);
    }

    this.shuffle();
    this.render();
  }

  render = () => {
    if (this.isEmpty()) {
      this.getMatching("visible", true).forEach((object) => {
        object.visible = false;
      });
      this.empty.visible = true;
    } else if (this.faceDown) {
      this.empty.visible = false;
      this.faceDownCard.visible = true;
    } else {
      this.empty.visible = false;
      this.getMatching("card", true).forEach((card, index) => {
        card.visible = index === 0;
      });
    }
  };

  draw = (count = 1) => {
    const cards = this.getMatching("card", true);
    const drawnCards = cards.slice(0, Math.min(count, cards.length));

    drawnCards.forEach((drawnCard) => {
      this.remove(drawnCard);
    });

    this.render();

    return drawnCards;
  };

  isEmpty = () => this.getMatching("card", true).length === 0;
}
