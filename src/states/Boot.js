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

    this.load.atlasJSONArray('chest', './assets/images/spritesheet/chest.png', './assets/data/spritesheet/chest.json')
    this.load.atlasJSONArray('shelf', './assets/images/spritesheet/shelf.png', './assets/data/spritesheet/shelf.json')
    this.load.atlasJSONArray('player', './assets/images/spritesheet/player.png', './assets/data/spritesheet/player.json')

    this.game.load.spritesheet('portal', './assets/images/portal.png', 32, 32)
    this.game.load.spritesheet('chest_closed', './assets/images/chest_closed.png', 32, 32)
    this.game.load.spritesheet('chest_open', './assets/images/chest_open.png', 32, 32)

    this.game.load.spritesheet('son', './assets/images/son.png', 32, 32)
    this.game.load.spritesheet('stargate', './assets/images/stargate.png', 64, 64)
    this.game.load.spritesheet('ice_cream', './assets/images/ice_cream.png', 32, 32)
    this.game.load.spritesheet('key', './assets/images/key.png', 32, 32)
    this.game.load.spritesheet('scissor', './assets/images/scissor.png', 32, 32)
    this.game.load.image('tiles', './assets/tilemaps/tiles/gridtiles.png')

    this.load.audio('game_music', './assets/audio/music/game.mp3')
    this.load.audio('game_win', './assets/audio/music/win.mp3')
    this.game.load.spritesheet('fatherson', './assets/images/fatherson.jpg')
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
