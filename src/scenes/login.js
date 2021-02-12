import messaging from "../messaging";

export default class Login extends Phaser.Scene {
  constructor() {
    super({ key: "Login" });
  }

  preload = () => {
    this.load.html("loginForm", "src/assets/text/loginform.html");
  };

  create = () => {
    this.scene.start("Game");

    this.element = this.add.dom(640, 600).createFromCache("loginForm");
    window.element = this.element;

    this.element.setPerspective(800);
    this.element.addListener("click");
    this.element.on("click", this.formSubmit);

    this.tweens.add({
      targets: this.element,
      y: 400,
      duration: 2000,
      ease: "Power3",
    });
  };

  formSubmit = (event) => {
    if (event.target.name === "loginButton") {
      let inputUsername = this.element.getChildByName("username");
      let inputGameId = this.element.getChildByName("gameId");

      //  Have they entered anything?
      if (inputUsername.value !== "" && inputGameId.value !== "") {
        //  Turn off the click events
        this.element.removeListener("click");
        messaging.on("created", this.handleJoin);
        messaging.on("joined", this.handleJoin);
        messaging.join(inputGameId.value, inputUsername.value);
      } else {
        let text = this.element.add.text(
          10,
          10,
          "Please create a game or join to play",
          {
            color: "white",
            fontFamily: "Arial",
            fontSize: "32px ",
          }
        );

        //  Flash the prompt
        this.tweens.add({
          targets: text,
          alpha: 0.1,
          duration: 200,
          ease: "Power3",
          yoyo: true,
        });
      }
    }
  };

  handleJoin = (event) => {
    if (event.success) {
      //  Tween the login form out
      this.tweens.add({
        targets: element.rotate3d,
        x: 1,
        w: 90,
        duration: 3000,
        ease: "Power3",
      });

      this.tweens.add({
        targets: element,
        scaleX: 2,
        scaleY: 2,
        y: 700,
        duration: 3000,
        ease: "Power3",
        onComplete: function () {
          element.setVisible(false);
        },
      });

      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        (cam, effect) => {
          this.scene.start("Loader");
        }
      );
    } else {
      let text = this.element.add.text(10, 10, "Connection failed", {
        color: "white",
        fontFamily: "Arial",
        fontSize: "32px ",
      });

      //  Flash the prompt
      this.tweens.add({
        targets: text,
        alpha: 0.1,
        duration: 200,
        ease: "Power3",
        yoyo: true,
      });

      this.element.on("click", this.formSubmit.bind(this));
    }
  };

  update = () => {};
}
