import cardData from "../assets/cards/star-realms-base.json";
import Explorer from "../sprites/cards/explorer";

export default class ExplorerPile {
  cards = [];

  constructor(scene) {
    let explorerCardData = cardData.find((data) => data.name === "Explorer");

    this.cards = Array.from({ length: explorerCardData.count }).forEach((_i) => {
      let explorerCard = new Explorer({
        scene,
        x: 280,
        y: 300,
      });

      explorerCard.visible = true;
      explorerCard.scale = 0.35;

      this.cards.push(explorerCard);
    });
  }
}