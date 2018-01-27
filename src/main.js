import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import IntroState from './states/Intro'
import GameState from './states/Game'
import MenuState from './states/Menu'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    const levels = [
        {
            tilemap: 'assets/tilemaps/maps/world01.json',
            exits: {
                'N': 2,
                'E': 3,
                'S': 5,
                'W': 4,
            },
        },
        {
            tilemap: 'assets/tilemaps/maps/world02.json',
            exits:{
                'N': 6,
                'E': 3,
                'S': 1,
                'W': 4,
            },
        },
        {
            tilemap: 'assets/tilemaps/maps/world03.json',
            exits:{
                'N': 5,
                'E': 1,
                'S': 2,
                'W': 6,
            },
        },
        {
            tilemap: 'assets/tilemaps/maps/world04.json',
            exits:{
                'N': 5,
                'E': 6,
                'S': 2,
                'W': 1,
            },
        },
        {
            tilemap: 'assets/tilemaps/maps/world05.json',
            exits:{
                'N': 1,
                'E': 3,
                'S': 6,
                'W': 4,
            },
        },
        {
            tilemap: 'assets/tilemaps/maps/world06.json',
            exits:{
                'N': 5,
                'E': 3,
                'S': 2,
                'W': 4,
            },
        },

    ]

    this.state.add('Boot', BootState, false)
    this.state.add('Intro', IntroState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Menu', MenuState, false)
    for (var i = 0; i < levels.length; i++) {
      var state = this.state.add('Game' + i, GameState, false);
    }

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start('Boot', true, false, levels)
    }
  }
}

window.game = new Game()

if (window.cordova) {
  var app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent('deviceready')

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Boot')
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id)
    }
  }

  app.initialize()
}
