import Card from "../helpers/card";
import TradeRow from "../helpers/trade-row";
import Zone from "../helpers/zone";
import Deck from "../helpers/deck";
import ExplorerPile from "../helpers/explorer-pile";

import DrawPile from "../helpers/draw-pile";
import Store from "../groups/decks/store";

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  preload = () => {
    this.load.image("logo", "src/assets/logo.png");
    this.load.spritesheet('starRealmsCards', 'src/assets/cards/star-realms-base.jpg', { frameWidth: 409, frameHeight: 568 });
    this.load.image("cardFront", "src/assets/front.png");
    this.load.image("cardBack", "src/assets/back.png");
  };

  create = () => {
    new Store({
      scene: this,
      x: 50,
      y: 50,
    })
    let pile = new DrawPile(this);
    let explorerPile = new ExplorerPile(this);

    let tradeRow = new TradeRow(pile.draw(5));


    let myDrawPile = new Deck();
    let myDiscardPile = new Deck();

    this.isPlayerOne = false;

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    let lastTime = 0;
    let expandedCard = null;
    this.input.on("pointerdown", (pointer, gameObject) => {
      let clickDelay = this.time.now - lastTime;
      lastTime = this.time.now;

      if (clickDelay < 350) {
        if (expandedCard) {
          expandedCard.resetScale();
        }

        let card = gameObject[0];
        if ((!card || expandedCard === card)) {
          expandedCard = null;
          return;
        }

        expandedCard = card;
        expandedCard.scale = 1;
      }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0xff69b4);
      gameObject.resetScale();
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
      tradeRow.replaceCard(gameObject, pile.draw()[0]);
    });
  };
}
