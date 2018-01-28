import Phaser from 'phaser'
import Inventory from '../models/inventory/inventory'

export default class Key extends Phaser.Sprite {

  constructor(game, x, y, level) {
    super(game, x, y, 'key');
    this.x = x
    this.y = y
    this.level = level
    this.loadTexture('key');
    this.game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  collect(player, key) {
    console.log("pick up")
    let currentItem = window.TheLostSon.playerInventory.getInventoryItem();
    if (currentItem == null) {
      window.TheLostSon.playerInventory.collectKey();
      player.loadTexture('key');
      player.game.velo = 200;
      key.remove();
    } else {
      console.log("cant pick up")
    }
  }

  remove() {
    for(var i in window.TheLostSon.items) {
      if (window.TheLostSon.items[i] == this) {
        window.TheLostSon.items[i].x = -100
        window.TheLostSon.items[i].y = -100
        break
      }
    }
    this.destroy()
  }
}

