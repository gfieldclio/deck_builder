import cardData from "../../assets/cards/star-realms-base.json";

export default class Base extends Phaser.GameObjects.Sprite {
  baseScale = 0.35;
  zoomScale = 1;
  card = true;
  zoomedSprite = null;

  constructor(config, index) {
    super(config.scene, config.x, config.y, "starRealmsCards", index);

    this.cardIndex = index;

    this.scale =
      config.visible === null || config.visible === undefined
        ? this.baseScale
        : config.scale;
    this.visible =
      config.visible === null || config.visible === undefined
        ? false
        : config.visible;
    if (config.angle) {
      this.angle = config.angle;
    }
    if (config.depth) {
      this.setDepth(config.depth);
    }

    this.scene.add.existing(this);

    if (
      config.interactive === null ||
      config.interactive === undefined ||
      config.interactive
    ) {
      this.setInteractive();
      this.scene.input.setDraggable(this);

      this.addZoomListeners();
    }
  }

  addZoomListeners = () => {
    this.on("pointerover", this.toggleZoom);
    this.on("pointerout", this.toggleZoom);
    this.scene.input.keyboard.on("keydown-ALT", this.toggleZoom);
    this.scene.input.keyboard.on("keyup-ALT", this.toggleZoom);
  };

  toggleZoom = () => {
    if (
      this.visible &&
      this.getBounds().contains(this.scene.input.x, this.scene.input.y) &&
      this.scene.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.ALT].isDown
    ) {
      if (!this.zoomedSprite) {
        const Klass = this.constructor;

        this.zoomedSprite = new Klass({
          angle: cardData[this.cardIndex].base ? 90 : 0,
          depth: 999,
          interactive: false,
          scale: this.zoomScale,
          scene: this.scene,
          visible: true,
          x: 640,
          y: 360,
        })
      }
    } else if (this.zoomedSprite) {
      this.zoomedSprite.destroy();
      this.zoomedSprite = null;
    }
  };
}
