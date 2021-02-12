import TradeRow from "../helpers/trade-row";
import Zone from "../helpers/zone";

import TradeDeck from "../groups/decks/trade";
import ExplorerDeck from "../groups/decks/explorer";
import DrawPileDeck from "../groups/decks/draw-pile";
import DiscardPileDeck from "../groups/decks/discard-pile";

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
    this.tradeDeck = new TradeDeck({
      scene: this,
      x: 280,
      y: 300,
    })
    this.explorerDeck = new ExplorerDeck({
      scene: this,
      x: 1200,
      y: 300,
    })
    this.drawPile = new DrawPileDeck({
      scene: this,
      x: 1050,
      y: 550,
    })
    this.discardPile = new DiscardPileDeck({
      scene: this,
      x: 1200,
      y: 550,
    })

    this.tradeRow = new TradeRow(this.tradeDeck.draw(5));

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
          expandedCard.zoomOut();
        }

        let card = gameObject[0];
        if ((!card || expandedCard === card)) {
          expandedCard = null;
          return;
        }

        expandedCard = card;
        expandedCard.zoomIn();
      }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0xff69b4);
      if (expandedCard === gameObject) {
        expandedCard.zoomOut();
        expandedCard = null;
      }
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

      if (this.tradeRow.contains(gameObject)) {
        this.tradeRow.replaceCard(gameObject, this.tradeDeck.draw()[0]);
      } else if (this.explorerDeck.contains(gameObject)) {
        this.explorerDeck.draw();
      }
    });
  };
}
