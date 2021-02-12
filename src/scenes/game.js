import Card from "../helpers/card";
import Dealer from "../helpers/dealer";
import Zone from "../helpers/zone";
import Deck from "../helpers/deck";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  preload = () => {
    this.load.image("logo", "src/assets/logo.png");
    this.load.image("cardFront", "src/assets/front.png");
    this.load.image("cardBack", "src/assets/back.png");
  };

  create = () => {
    let mainDeck = new Deck(true);
    let myDrawPile = new Deck();
    let myDiscardPile = new Deck();

    this.isPlayerOne = false;

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    this.dealer = new Dealer(this);
    this.dealer.dealCards();

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0xff69b4);
      this.children.bringToTop(gameObject);
    });

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      dropZone.data.values.cards++;
      gameObject.x = dropZone.x - 300 + dropZone.data.values.cards * 50;
      gameObject.y = dropZone.y;
      gameObject.disableInteractive();
    });
  };
}
