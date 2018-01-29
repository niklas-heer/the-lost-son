import Phaser from 'phaser'

export default class extends Phaser.State {

  init () {
    this.introCompleted = false
  }

  create () {
    const text = 'The Father found his son again\n and they teleported to the office together\n\n Now reunited\n in front of a game console\n they play a game...'
    this.game.stage.backgroundColor = 0x272822
    this.introText = this.add.text(
      this.camera.centerX - 25,
      this.camera.height,
      text,
      {
        font: '44px Bangers',
        fill: '#e5e817',
        smoothed: false,
        align: 'center'
      })

    this.introText.anchor.setTo(0)
    this.introText.wordWrap = false
    this.introText.setTextBounds(25, 25, this.camera.width - 25, this.camera.height)
    this.introText.width = this.camera.width - 50
    this.finpic = this.game.add.sprite(0, this.game.height, 'fatherson')

    this.spacebarKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.backgroundsound = this.game.add.audio('game_win')
    this.backgroundsound.play()
    this.backgroundsound.volume = 0.5
  }

  update () {
    if (this.spacebarKey.isDown) {
      window.location.reload()
    }

    if (this.introText && this.introText.position.y > -200) {
      this.introText.position.y -= 2
      if (this.introText.position.y + this.introText.height + 25 < this.game.height) {
        this.finpic.position.y -= 2
      }
    }
  }
}
