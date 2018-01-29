import Phaser from 'phaser'

export default class Portal extends Phaser.Sprite {
  constructor(game, x, y, level) {
    super(game, x, y, 'stargate')
    this.x = x
    this.y = y
    this.level = level
    this.game.add.existing(this)
    this.game.physics.enable(this, Phaser.Physics.ARCADE)
  }

  enter() {
    if (window.TheLostSon.playerInventory.isSonWithYou()) {
      this.state.start('Finish')
      this.game.sound.stopAll()
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
