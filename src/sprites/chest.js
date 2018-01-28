import Phaser from 'phaser'
import Inventory from '../models/inventory/inventory'

export default class Chest extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'chest');
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
}
