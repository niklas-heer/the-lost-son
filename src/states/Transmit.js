import Phaser from 'phaser';
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init (image64, nextgame, index, direction) {
    this.image64 = image64;
    this.nextgame = nextgame;
    this.index = index;
    this.direction = direction;
    this.duration = 1000;
  }

  preload () {
    this.game.load.image('screenshot', this.image64);
    this.load.audio('papercrunch', './assets/audio/sound/Papier.mp3')
  }

  nextlevel () {
    this.state.start(this.nextgame, true, false, this.index, this.direction);
  }

  fadeout () {
    game.add.tween(this.pic.scale).to({x: 3, y: 3}, this.duration + 1000, "Linear", true, 0, 0);
    game.add.tween(this.pic).to({alpha: 0}, this.duration, "Linear", true, 0, 0);
    this.rotate2 = game.add.tween(this.pic).to({angle: 360}, this.duration, "Linear", true, 0, 0);
    this.rotate2.onComplete.add(this.nextlevel, this);    
  }

  create () {
    this.sound = this.game.add.audio('papercrunch')
    this.pic = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'screenshot');
    this.pic.anchor.setTo(0.5, 0.5);
    this.sound.play();
    game.add.tween(this.pic.scale).to({x: 0.02, y: 0.02}, this.duration, "Linear", true, 0, 0);

    this.rotate = game.add.tween(this.pic).to({angle: 360}, this.duration, "Linear", true, 0, 0);
    this.rotate.onComplete.add(this.fadeout, this);    

  }

  update () {

  }

}

