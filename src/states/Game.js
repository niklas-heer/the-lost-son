/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {

    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType (type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  }

  init () {
    this.velo = 400;
  }

  preload () {
    this.game.load.spritesheet('player', 'assets/images/star.png', 32, 32);
    this.game.load.spritesheet('portal', 'assets/images/portal.png', 32, 32);
    this.game.load.spritesheet('power', 'assets/images/power.png', 32, 32);
    this.game.load.spritesheet('key', 'assets/images/key.png', 32, 32);
    this.game.load.spritesheet('chest_closed', 'assets/images/chest_closed.png', 32, 32);
    this.game.load.spritesheet('chest_open', 'assets/images/chest_open.png', 32, 32);
    this.game.load.spritesheet('star_with_power', 'assets/images/star_with_power.png', 32, 32);
    this.game.load.spritesheet('star_with_key', 'assets/images/star_with_key.png', 32, 32);
    this.game.load.tilemap('map', 'assets/tilemaps/maps/world01.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/tilemaps/tiles/gridtiles.png');

  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('gridtiles', 'tiles');

    this.groundLayer = this.map.createLayer('Ground');
    this.collisionLayer = this.map.createLayer('Collision');
    // this.game.physics.enable(this.collisionLayer, Phaser.Physics.ARCADE);


    this.game.stage.backgroundColor = "#1d981d";

    // this.map.setCollisionByExclusion([], true, this.groundLayer);
    this.map.setCollisionByExclusion([], true, this.collisionLayer);
    //this.map.setCollisionBetween(1, 100000, true, this.collisionLayer);


    // this.groundLayer.visible = true;

    var result = this.findObjectsByType('power', this.map, 'Objects');
    this.power = this.game.add.sprite(result[0].x, result[0].y, 'power');
    this.game.physics.enable(this.power, Phaser.Physics.ARCADE);

    var result = this.findObjectsByType('chest', this.map, 'Objects');
    this.chest = this.game.add.sprite(result[0].x, result[0].y, 'chest_closed');
    this.game.physics.enable(this.chest, Phaser.Physics.ARCADE);
    this.chest.body.immovable = true;

    var result = this.findObjectsByType('key', this.map, 'Objects');
    this.key = this.game.add.sprite(result[0].x, result[0].y, 'key');
    this.game.physics.enable(this.key, Phaser.Physics.ARCADE);

    var result = this.findObjectsByType('portal', this.map, 'Objects');
    this.portal = this.game.add.sprite(result[0].x, result[0].y, 'portal');
    this.game.physics.enable(this.portal, Phaser.Physics.ARCADE);


    var result = this.findObjectsByType('player', this.map, 'Objects');
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.has_power = false;
    this.player.has_key = false;

    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.groundLayer.resizeWorld();
  }

  update() {
    // this.game.physics.arcade.collide(this.sprite, this.groundLayer);
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    // this.game.physics.arcade.collide(this.player, this.chest);

    this.game.physics.arcade.overlap(this.player, this.power, this.collectPower, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal, this.enterPortal, null, this);
    this.game.physics.arcade.overlap(this.player, this.key, this.collectKey, null, this);
    this.game.physics.arcade.overlap(this.player, this.chest, this.openChest, null, this);


    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    if(this.cursors.up.isDown) {
      this.player.body.velocity.y -= this.velo;
    }
    else if(this.cursors.down.isDown) {
      this.player.body.velocity.y += this.velo;
    }
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x -= this.velo;
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x += this.velo;
    }
}

  collectPower(player, power) {
      power.destroy();

      this.player.has_power = true;
      this.player.loadTexture('star_with_power', 0);
      this.velo = 200;
  }

  openChest(player, chest) {
      if(player.has_key) {
          this.chest.loadTexture('chest_open', 0);
          player.has_key = false;
          player.loadTexture('player', 0);
      }
  }

  collectKey(player, key) {
      key.destroy();

      this.player.has_key = true;
      this.player.loadTexture('star_with_key', 0);
  }

  enterPortal(player, portal) {
      if(player.has_power) {
          portal.destroy();
      }
  }
}

