import messaging from "../messaging";

export default class Loader extends Phaser.Scene {
  constructor() {
    super({ key: "Loader" });
  }

  preload() {
    this.load.spritesheet("loader", "src/assets/loader.png", {
      frameWidth: 400,
      frameHeight: 300,
    });
  }

  create() {
    this.anims.create({
      key: "loading",
      frames: this.anims.generateFrameNumbers("loader"),
      frameRate: 16,
    });
    this.add.sprite(400, 300, "loader").play({ key: "loading", repeat: -1 });

    if (messaging.dataChannelIsOpen) {
      this.scene.start("Game");
    } else {
      messaging.on('dataChannelOpen', () => {
        console.log('Release the hounds!');
        this.scene.start("Game");
      });
    }
  }

  update() {}
}
