export default class Base extends Phaser.GameObjects.Sprite {
  constructor(config, index) {
    super(config.scene, config.x, config.y, "starRealmsCards", index);

    this.scale = 0.2;

    this.scene.add.existing(this);
    this.setInteractive();
    this.scene.input.setDraggable(this);

    window.test = this;
  }
}
