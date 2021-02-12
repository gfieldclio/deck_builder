import cardData from "../../assets/cards/star-realms-base.json";
import Base from './base';
import ExplorerCard from '../../sprites/cards/explorer';

export default class Store extends Base {
  constructor(config) {
    config.faceDown = false;

    config.cards = []
    const data = cardData.find(data => data.name === "Explorer");
    Array.from({ length: data.count }).forEach((_i) => {
      config.cards.push(
        new ExplorerCard({
          scene: config.scene,
          x: config.x,
          y: config.y,
        })
      );
    });

    window.test = config.cards;

    super(config)
  }
}
