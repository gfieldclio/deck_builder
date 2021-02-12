import Base from './base';
import ScoutCard from '../../sprites/cards/scout';
import ViperCard from '../../sprites/cards/viper';

export default class DrawPile extends Base {
  constructor(config) {
    config.cards = []
    Array.from({ length: 8 }).forEach((_i) => {
      config.cards.push(
        new ScoutCard({
          scene: config.scene,
          x: config.x,
          y: config.y,
        })
      );
    });
    Array.from({ length: 2 }).forEach((_i) => {
      config.cards.push(
        new ViperCard({
          scene: config.scene,
          x: config.x,
          y: config.y,
        })
      );
    });

    super(config)
  }
}
