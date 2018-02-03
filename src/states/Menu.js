import Phaser from 'phaser'
import TextButton from '../extensions/textbutton'

export default class Menu extends Phaser.State {

  create() {
    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background_menu')
    this.music = this.game.add.audio('menuMusic')

    this.start = new TextButton({
      game: this.game,
      x: this.game.world.centerX,
      y: this.game.world.centerY + 140,
      asset: 'start_btn',
      overFrame: 1,
      outFrame: 0,
      downFrame: 2,
      upFrame: 0,
      label: 'Start',
      style: {
        font: '26px Pangolin',
        fill: 'white',
        align: 'center'
      }
    })

    this.btnOverSound = this.add.sound('menuOver')
    this.btnOutSound = this.add.sound('menuOut')
    this.btnDownSound = this.add.sound('menuDown')

    this.start.setOverSound(this.btnOverSound)
    this.start.setOutSound(this.btnOutSound)
    this.start.setDownSound(this.btnDownSound)

    this.start.onInputUp.add(() => {
      this.music.stop()
      this.state.start('Intro')
    })

    this.menuPanel = this.add.group()

    this.menuPanel.add(this.start)

    this.music.loopFull()

    this.music.volume = 0.5

    this.spacebarKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  }
  update() {
    if (this.spacebarKey.isDown)
    {
      this.music.stop()
      this.state.start('Intro')
    }
  }
}
