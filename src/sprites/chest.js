import Phaser from 'phaser'
import Inventory from '../models/inventory/inventory'

export default class Chest extends Phaser.Sprite {
  constructor(game, x, y, level) {
    super(game, x, y, 'chest');
    this.x = x
    this.y = y
    this.level = level
    this.createNewChest(x, y);
    this.game.add.existing(this);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  createNewChest(newXCoord, newYCoord) {
    if (window.TheLostSon.playerInventory.keyUsed) {
      this.frame = 1;
      this.isOpen = true;
    } else {
      this.frame = 0;
      this.isOpen = false;
    }
  }

  openChest(player, chest) {
    if(this.canOpenChest(player)) {
      this.loadTexture('chest_open', 0);

      window.TheLostSon.playerInventory.useKeyOnChest();

      window.TheLostSon.playerInventory.receiveHedgeTrimmer();
      player.loadTexture('player', 0);
    }
  }

  canOpenChest() {
    let currentInventoryItem = window.TheLostSon.playerInventory.getInventoryItem();

    return !this.isOpen &&
      !window.TheLostSon.playerInventory.keyUsed &&
      currentInventoryItem != null &&
      currentInventoryItem.isKey();
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
