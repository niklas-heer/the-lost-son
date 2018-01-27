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


  init (levels, index, direction) {

    this.velo = 250;
    this.direction = direction

    if (this.loaded != true) {
      this.first = true;
      this.st = {
        has_key: true
      };
    } else {
      this.first = false;
    }

    this.loaded = true;

    this.levels = levels;
    this.level_index = index;
  }

  preload () {
    this.game.load.spritesheet('player', './assets/images/player.png', 32, 32);
    this.game.load.spritesheet('portal', './assets/images/portal.png', 32, 32);
    this.game.load.spritesheet('power', './assets/images/power.png', 32, 32);
    this.game.load.spritesheet('key', './assets/images/key.png', 32, 32);
    this.game.load.spritesheet('chest_closed', './assets/images/chest_closed.png', 32, 32);
    this.game.load.spritesheet('chest_open', './assets/images/chest_open.png', 32, 32);
    this.game.load.spritesheet('star_with_power', './assets/images/star_with_power.png', 32, 32);
    this.game.load.spritesheet('star_with_key', './assets/images/star_with_key.png', 32, 32);
    this.game.load.tilemap('map', this.levels[this.level_index].tilemap, null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', './assets/tilemaps/tiles/gridtiles.png');

  }

  create () {

    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('gridtiles', 'tiles');

    // this.groundLayer = this.map.createLayer('Ground');
    this.collisionLayer = this.map.createLayer('Collision');
    // this.game.physics.enable(this.collisionLayer, Phaser.Physics.ARCADE);




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

    if (this.st.has_key) {
      var result = this.findObjectsByType('key', this.map, 'Objects');
      this.key = this.game.add.sprite(result[0].x, result[0].y, 'key');
      this.game.physics.enable(this.key, Phaser.Physics.ARCADE);
    }

    var results = this.findObjectsByType('portalN', this.map, 'Objects');
    this.portal_n = this.game.add.sprite(results[0].x, results[0].y, 'portal');
    this.game.physics.enable(this.portal_n, Phaser.Physics.ARCADE);

    var results = this.findObjectsByType('portalE', this.map, 'Objects');
    this.portal_e = this.game.add.sprite(results[0].x, results[0].y, 'portal');
    this.game.physics.enable(this.portal_e, Phaser.Physics.ARCADE);

    var results = this.findObjectsByType('portalS', this.map, 'Objects');
    this.portal_s = this.game.add.sprite(results[0].x, results[0].y, 'portal');
    this.game.physics.enable(this.portal_s, Phaser.Physics.ARCADE);

    var results = this.findObjectsByType('portalW', this.map, 'Objects');
    this.portal_w = this.game.add.sprite(results[0].x, results[0].y, 'portal');
    this.game.physics.enable(this.portal_w, Phaser.Physics.ARCADE);

    var result = this.findObjectsByType('player', this.map, 'Objects');
    if ((result.length != 0) && this.first) {
      posx = result[0].x
      posy = result[0].y
    } else {
      var addx = 0;
      var addy = 0;
      var diff = 50;
      var portalpos;
      var posx, posy;
      if (this.direction == 0) {
        portalpos = this.portal_s.position
        addx = 0;
        addy = -diff;
      } else if (this.direction == 1) {
        portalpos = this.portal_w.position
        addx = diff;
        addy = 0;
      } else if (this.direction == 2) {
        portalpos = this.portal_n.position
        addx = 0;
        addy = diff;
      } else {
        portalpos = this.portal_e.position
        addx = -diff;
        addy = 0;
      }

      posx = portalpos.x + addx
      posy = portalpos.y + addy
    }
    this.player = this.game.add.sprite(posx, posy, 'player');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);


    this.player.has_power = false;
    this.player.has_key = false;

    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    // this.groundLayer.resizeWorld();
  }

  update() {
    // this.game.physics.arcade.collide(this.sprite, this.groundLayer);
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    // this.game.physics.arcade.collide(this.player, this.chest);

    this.game.physics.arcade.overlap(this.player, this.power, this.collectPower, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal_n, this.enterPortalN, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal_e, this.enterPortalE, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal_s, this.enterPortalS, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal_w, this.enterPortalW, null, this);
    this.game.physics.arcade.overlap(this.player, this.key, this.collectKey, null, this);
    this.game.physics.arcade.overlap(this.player, this.chest, this.openChest, null, this);

    this.player.body.maxVelocity.setTo(this.velo, this.velo);

    if(this.cursors.up.isDown) {
      this.player.body.acceleration.y -= this.velo;
    }
    else if(this.cursors.down.isDown) {
      this.player.body.acceleration.y += this.velo;
    }
    else {
      if (this.player.body.velocity.y > (this.velo / 10)) {
        this.player.body.acceleration.y = -(this.velo * 10);
      }
      else if (this.player.body.velocity.y < -(this.velo / 10)) {
        this.player.body.acceleration.y = (this.velo * 10);
      }
      else {
        this.player.body.acceleration.y = 0;
        this.player.body.velocity.y = 0;
      }
    }
    if(this.cursors.left.isDown) {
      this.player.body.acceleration.x -= this.velo;
    }
    else if(this.cursors.right.isDown) {
      this.player.body.acceleration.x += this.velo;
    }
    else {
      if (this.player.body.velocity.x > (this.velo / 10)) {
        this.player.body.acceleration.x = -(this.velo * 10);
      }
      else if (this.player.body.velocity.x < -(this.velo / 10)) {
        this.player.body.acceleration.x = (this.velo * 10);
      }
      else {
        this.player.body.acceleration.x = 0;
        this.player.body.velocity.x = 0;
      }
    }

    this.rotatePlayer(this.player.body.velocity.x, this.player.body.velocity.y, this.player.body.acceleration.x, this.player.body.acceleration.y)
  }

  shutdown() {
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
    this.st.has_key = false;

    this.player.has_key = true;
    this.player.loadTexture('star_with_key', 0);
  }

  toLevel(index, direction) {
    this.state.start('Game' + index, true, false, this.levels, index, direction);
  }

  enterPortal(player, portal, direction) {
    var newlvl;
    if (direction == 0) {
      newlvl = this.levels[this.level_index].exits['N'];
    } else if (direction == 1) {
      newlvl = this.levels[this.level_index].exits['E'];
    } else if (direction == 2) {
      newlvl = this.levels[this.level_index].exits['S'];
    } else {
      newlvl = this.levels[this.level_index].exits['W'];
    }
    newlvl -= 1; // zero indexing
    this.toLevel(newlvl, direction)
  }

  rotatePlayer(x, y, accX, accY) {
    var rad = Math.atan2(y, x);
    var deg = rad * (180 / Math.PI);
    if (accX !== 0 || accY !== 0) {
      this.player.angle = deg;
    }
  }

  enterPortalN(player, portal) { this.enterPortal(player, portal, 0) }
  enterPortalE(player, portal) { this.enterPortal(player, portal, 1) }
  enterPortalS(player, portal) { this.enterPortal(player, portal, 2) }
  enterPortalW(player, portal) { this.enterPortal(player, portal, 3) }
}
