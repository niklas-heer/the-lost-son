import Phaser from 'phaser'
import Inventory from '../models/inventory/inventory'

export default class Shelve extends Phaser.Sprite {
  constructor(game, x, y, hasBatterie) {
    super(game, x, y, 'shelve');
    this.game.add.existing(this);
    this.frame = 1;
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.hasBatterie = hasBatterie;
  }

  removeBatterie() {
    if (this.hasBatterie) {
      this.hasBatterie = false;
      this.frame = 0;
    }
  }

  collectBatterie(player, shelveWithBatterie) {
    let currentItem = window.TheLostSon.playerInventory.getInventoryItem();
    if (window.TheLostSon.playerInventory.isSonWithYou() &&
      currentItem == null) {
      window.TheLostSon.playerInventory.getDownBatterie();
      player.game.velo = 200;
      shelveWithBatterie.removeBatterie();
    }
  }
}