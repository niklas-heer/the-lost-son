import Phaser from 'phaser'
import Inventory from '../models/inventory/inventory'

export default class Son extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'son');
    this.game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  convinceWithIcecream(player, son) {
    let currentItem = window.TheLostSon.playerInventory.getInventoryItem();

    if (currentItem != null &&
        currentItem.isIcecream()) {
      window.TheLostSon.playerInventory.convinceSon();

      window.TheLostSon.playerInventory.eatIcecream();
      player.frame = 1;
      player.game.velo = 200;
      son.destroy();
    }
  }
}
