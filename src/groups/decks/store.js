import cardData from "../../assets/cards/star-realms-base.json";
import Base from './base';

export default class Store extends Base {
  constructor(config) {
    config.cards = []
    cardData.forEach((data) => {
      if (data.faction === "Unaligned") {
        return;
      }

      const classFile = data.name.toLowerCase().split(" ").join("-");
      const Klass = require(`../../sprites/cards/${classFile}`).default;

      Array.from({ length: data.count }).forEach((_i) => {
        config.cards.push(
          new Klass({
            scene: config.scene,
            x: config.x,
            y: config.y,
          })
        );
      });
    });

    super(config)
  }
}
