import Base from './base';

export default class DiscardPile extends Base {
  constructor(config) {
    config.faceDown = false;
    config.cards = []

    super(config)
  }
}
