import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import IntroState from './states/Intro'
import GameState from './states/Game'
import MenuState from './states/Menu'
import TransmitState from './states/Transmit'
import FinishState from './states/Finish.js'

import config from './config'

import Inventory from './models/inventory/inventory'

window.TheLostSon = window.TheLostSon || {}
window.TheLostSon.items = window.TheLostSon.items || []

window.TheLostSon.playerInventory = window.TheLostSon.playerInventory || new Inventory()
window.TheLostSon.levels = window.TheLostSon.levels || [
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

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Intro', IntroState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Menu', MenuState, false)
    this.state.add('Transmit', TransmitState, false)
    this.state.add('Finish', FinishState, false)

    for (var i = 0; i < window.TheLostSon.levels.length; i++) {
      var state = this.state.add('Game' + i, GameState, false);
    }

    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start('Boot')
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



/**
  * Phaser Touch Cursor Plugin
  * Adds native cursor movement for touch screen devices

	The MIT License (MIT)

	Copyright (c) 2014 Eugenio Fage
	Copyright (c) 2015 Nathan Bawden

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.

	Original Contact: https://github.com/eugenioclrc, @eugenioclrc
	Contact: http://code.playnexus.com

  */

  (function (Phaser) {
    //'use strict';
    /**
     * TouchCursor Plugin for Phaser
     */
    Phaser.Plugin.TouchCursor = function (game, parent) {
        /* Extends the plugin */
        this.isTouch = !game.device.desktop;
        //this.isTouch = true;
        Phaser.Plugin.call(this, game, parent);
        this.input = game.input;
        this.cursors = {
            up: {
                isDown: false
            },
            down: {
                isDown: false
            },
            left: {
                isDown: false
            },
            right: {
                isDown: false
            },
            speed: {
                x: 0,
                y: 0,
                xa: 0,
                ya: 0,
                top: 0
            },
            isTouch: this.isTouch,
            hasTouch: false
        };

    };

    //Extends the Phaser.Plugin template, setting up values we need
    Phaser.Plugin.TouchCursor.prototype = Object.create(Phaser.Plugin.prototype);
    Phaser.Plugin.TouchCursor.prototype.constructor = Phaser.Plugin.TouchCursor;

    Phaser.Plugin.TouchCursor.prototype.createCursorKeys = function (settings /*optional*/ ) {
        // Load optional instance settings
        if (settings) for (var n in settings) {
            this.settings[n] = settings[n];
        }

        if (this.settings.autodetect && !this.settings.both && !this.isTouch) {
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.cursors.isTouch = false;
            this.cursors.hasTouch = false;
            return this.cursors;
        }

        if (this.settings.both) {
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.cursors.isTouch = this.isTouch;
            this.cursors.speed = {
                x: 0,
                y: 0,
                top: 0,
                xa: 0,
                ya: 0
            };
        }

        if (this.settings.touchImage) {
            this.images = [];
            this.images.push(this.game.add.sprite(0, 0, 'touchcursor_compass'));
            this.images.push(this.game.add.sprite(0, 0, 'touchcursor_finger'));
            this.images.push(this.game.add.sprite(0, 0, 'touchcursor_finger'));
            this.images.push(this.game.add.sprite(0, 0, 'touchcursor_touched'));
            this.images.forEach(function (e) {
                e.anchor.set(0.5);
                e.visible = false;
                e.fixedToCamera = true;
            });
        }

        this.input.onDown.add(createCompass, this);
        this.input.onUp.add(removeCompass, this);
        this.cursors.hasTouch = true;
        return this.cursors;
    };

    // Default settings
    Phaser.Plugin.TouchCursor.prototype.settings = {
        maxDistance: 200, // max distance from initial touch
        triggerSpeed: 12, // minimum speed to trigger key down
        lockAxis: false, // lock to x and y axis - no diagonal
        both: false, // combine keyboard and touch/mouse input
        autodetect: false, // autodetect keyboard or touch
        touchImage: false // display images at touch points
    };

    Phaser.Plugin.TouchCursor.prototype.inputDisable = function () {
        this.input.onDown.remove(createCompass, this);
        this.input.onUp.remove(removeCompass, this);
    };

    var initialPoint;

    var createCompass = function () {
        if (this.settings.touchImage) {
            this.images.forEach(function (e) {
                e.visible = true;
                e.bringToTop();
                e.cameraOffset.x = this.input.worldX;
                e.cameraOffset.y = this.input.worldY;
            }, this);
        }

        this.preUpdate = setDirection.bind(this);

        initialPoint = this.input.activePointer.position.clone();

    };

    var removeCompass = function () {
        var cc = this.cursors;
        if (this.settings.touchImage) {
            this.images.forEach(function (e) {
                e.visible = false;
            });
        }

        cc.up.isDown = cc.down.isDown = false;
        cc.right.isDown = cc.left.isDown = false;
        cc.speed.x = cc.speed.y = cc.speed.top = 0;
        cc.speed.xa = cc.speed.ya = 0;

        this.preUpdate = noop;
    };

    var noop = function () {};

    var setDirection = function () {
        var cc = this.cursors;
        var d = initialPoint.distance(this.input.activePointer.position);
        var maxDistance = this.settings.maxDistance;

        var deltaX = this.input.activePointer.position.x - initialPoint.x;
        var deltaY = this.input.activePointer.position.y - initialPoint.y;

        if (this.settings.lockAxis) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaY = 0;
                this.input.activePointer.position.y = initialPoint.y;
            } else {
                deltaX = 0;
                this.input.activePointer.position.x = initialPoint.x;
            }
        }
        var angle = initialPoint.angle(this.input.activePointer.position);

        if (d > maxDistance) {
            deltaX = Math.cos(angle) * maxDistance;
            deltaY = Math.sin(angle) * maxDistance;
        }

        cc.speed.x = parseInt((deltaX / maxDistance) * 100 * -1, 10);
        cc.speed.y = parseInt((deltaY / maxDistance) * 100 * -1, 10);
        cc.speed.xa = Math.abs(cc.speed.x);
        cc.speed.ya = Math.abs(cc.speed.y);
        cc.speed.top = Math.max(cc.speed.xa, cc.speed.ya);

        var mdd = this.settings.triggerSpeed;
        cc.up.isDown = (deltaY < 0) && cc.speed.ya >= mdd;
        cc.down.isDown = (deltaY > 0) && cc.speed.ya >= mdd;
        cc.left.isDown = (deltaX < 0) && cc.speed.xa >= mdd;
        cc.right.isDown = (deltaX > 0) && cc.speed.xa >= mdd;

        if (this.settings.touchImage) {
            this.images.forEach(function (e, i) {
                e.cameraOffset.x = initialPoint.x + (deltaX) * i / 3;
                e.cameraOffset.y = initialPoint.y + (deltaY) * i / 3;
            }, this);
        }
    };

    Phaser.Plugin.TouchCursor.prototype.preUpdate = noop;

}(Phaser));

