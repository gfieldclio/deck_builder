export default class CardBack extends Phaser.GameObjects.Sprite {
  baseScale = 0.35;

  constructor(config) {
    super(config.scene, config.x, config.y, "starRealmsCards", 49);

    this.scale = this.baseScale;
    this.visible = false;

    this.scene.add.existing(this);
    this.setInteractive();
  }
}
