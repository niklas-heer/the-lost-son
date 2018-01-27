import Phaser from 'phaser'
import TextButton from '../extensions/textbutton';

export default class Menu extends Phaser.State {

  create() {
    this.music = this.game.add.audio('menuMusic')
    this.title = new Phaser.Text(this.game,
      this.game.world.centerX, this.world.centerY - 80,
      'The lost son ', {
        font: '36px Bangers',
        fill: '#77BFA3',
        align: 'center',
        smoothed: false
      })
    this.title.anchor.setTo(0.5)

    this.start = new TextButton({
      game: this.game,
      x: this.game.world.centerX,
      y: this.game.world.centerY,
      asset: 'button',
      overFrame: 2,
      outFrame: 1,
      downFrame: 0,
      upFrame: 1,
      label: 'Start',
      style: {
        font: '16px Verdana',
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
      this.state.start('Game')
    })

    this.menuPanel = this.add.group()
    this.menuPanel.add(this.title)
    this.menuPanel.add(this.start)

    this.music.loopFull()
  }
}