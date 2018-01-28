import Phaser from 'phaser'
import TextButton from '../extensions/textbutton';

export default class Menu extends Phaser.State {

  init () {
  }

  create() {
    this.music = this.game.add.audio('menuMusic')
    this.title = new Phaser.Text(this.game,
      this.game.world.centerX, this.world.centerY - 120,
      'The lost son ', {
        font: '76px Bangers',
        fill: '#77BFA3',
        align: 'center',
        smoothed: false
      })
    this.title.anchor.setTo(0.5)

    this.start = new TextButton({
      game: this.game,
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      asset: 'start_btn',
      overFrame: 1,
      outFrame: 0,
      downFrame: 2,
      upFrame: 0,
      label: 'Start',
      style: {
        font: '26px Verdana',
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
    this.menuPanel.add(this.title)
    this.menuPanel.add(this.start)

    this.music.loopFull()

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
