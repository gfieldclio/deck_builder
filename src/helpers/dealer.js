import Card from "./card";

export default class Shop {
  constructor(scene) {
    this.scene = scene;
  }

  renderShop = (cards) => {
    cards.forEach((card, i) => {
      let playerCard = new Card(this.scene);
      playerCard.render(430 + i * 100, 650, card);
    });
  };

  dealCards = () => {
    let playerSprite;
    let opponentSprite;

    playerSprite = "logo"

    // if (scene.isPlayerA) {
    //     playerSprite = 'cyanCardFront';
    //     opponentSprite = 'magentaCardBack';
    // } else {
    //     playerSprite = 'magentaCardFront';
    //     opponentSprite = 'cyanCardBack';
    // };

    for (let i = 0; i < 5; i++) {
        let playerCard = new Card(this.scene);
        playerCard.render(475 + (i * 100), 650, playerSprite);

        // let opponentCard = new Card(scene);
        // scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
    }
  }

}
