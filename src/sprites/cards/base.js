import cardData from '../../assets/cards/star-realms-base.json';

export default class Base extends Phaser.GameObjects.Sprite {
  baseScale = 0.35;

  constructor(config, index) {
    super(config.scene, config.x, config.y, "starRealmsCards", index);

    this.data = cardData[index];

    this.scale = this.baseScale;
    this.visible = false;

    this.scene.add.existing(this);
    this.setInteractive();
    this.scene.input.setDraggable(this);
  }

  resetScale = () => {
    this.scale = this.baseScale;
  }
}
