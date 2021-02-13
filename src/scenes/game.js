import TradeRow from "../helpers/trade-row";
import PlayerHand from "../helpers/player-hand";
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
    this.input.keyboard.addKey('ALT')

    this.health = 50;
    this.gold = 0;
    this.attack = 0;

    this.health = this.add.text(1050, 400, '50', { color: '#5fb460', fontFamily: 'Helvetica', fontSize: '32px'});
    this.gold = this.add.text(1100, 400, '0', { color: '#edc223', fontFamily: 'Helvetica', fontSize: '32px'});
    this.attack = this.add.text(1160, 400, '0', { color: '#de462d', fontFamily: 'Helvetica', fontSize: '32px'});

    this.tradeDeck = new TradeDeck({
      scene: this,
      x: 280,
      y: 300,
    });
    this.explorerDeck = new ExplorerDeck({
      scene: this,
      x: 1200,
      y: 300,
    });
    this.drawPile = new DrawPileDeck({
      scene: this,
      x: 1050,
      y: 550,
    });
    this.discardPile = new DiscardPileDeck({
      scene: this,
      x: 1200,
      y: 550,
      droppable: true,
    });

    this.tradeRow = new TradeRow(this.tradeDeck.draw(5));
    this.playerHand = new PlayerHand(this.drawPile.draw(5));

    this.isPlayerOne = false;

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    this.lastTime = 0;
    this.expandedCard = null;

    // this.input.on("pointerdown", this.pointerDown);
    this.input.on("drag", this.drag);
    this.input.on("dragstart", this.dragStart);
    this.input.on("dragend", this.dragEnd);
    this.input.on("drop", this.drop);
  };

  // pointerDown = (pointer, gameObject) => {
  //   let clickDelay = this.time.now - this.lastTime;
  //   this.lastTime = this.time.now;

  //   if (clickDelay < 350) {
  //   }
  // }

  drag = (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
  }

  dragStart = (pointer, gameObject) => {
    gameObject.setTint(0xff69b4);
    if (this.expandedCard === gameObject) {
      this.expandedCard.zoomOut();
      this.expandedCard = null;
    }
    this.children.bringToTop(gameObject);
  }

  dragEnd = (pointer, gameObject, dropped) => {
    gameObject.setTint();
    if (!dropped) {
      gameObject.x = gameObject.input.dragStartX;
      gameObject.y = gameObject.input.dragStartY;
    }
  }

  drop = (pointer, gameObject, dropZone) => {
    dropZone.data.values.cards++;
    gameObject.x = dropZone.x - 300 + dropZone.data.values.cards * 50;
    gameObject.y = dropZone.y;
    gameObject.disableInteractive();

    if (this.tradeRow.contains(gameObject)) {
      this.tradeRow.replaceCard(gameObject, this.tradeDeck.draw()[0]);
    } else if (this.explorerDeck.contains(gameObject)) {
      this.explorerDeck.draw();
    }
  }
}
