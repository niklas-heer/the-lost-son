import Phaser from 'phaser'
import Inventory from '../models/inventory/inventory'

export default class IceCream extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'ice_cream');
    this.loadTexture('ice_cream');
    this.game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  collect(player, ice_cream) {
    let currentItem = window.TheLostSon.playerInventory.getInventoryItem();
    if (currentItem == null) {
      window.TheLostSon.playerInventory.collectIcecream();
      player.loadTexture('ice_cream');
      player.game.velo = 200;
      ice_cream.destroy();
    }
  }
}