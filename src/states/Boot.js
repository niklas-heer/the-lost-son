import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.atlasJSONArray('start_btn', './assets/images/spritesheet/start_btn.png', './assets/data/spritesheet/start_btn.json')

    this.load.audio('menuMusic', './assets/audio/music/menu.mp3')

    this.load.audio('menuOver', './assets/audio/sound/menu-over.mp3')
    this.load.audio('menuOut', './assets/audio/sound/menu-out.mp3')
    this.load.audio('menuDown', './assets/audio/sound/menu-click.mp3')

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

    this.load.image('background', './assets/images/background.png')
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash');
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
