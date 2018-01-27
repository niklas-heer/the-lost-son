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


  init (levels, index) {

    this.velo = 400;

    if (this.loaded != true) {
      this.st = { has_key: true };
    }

    this.loaded = true;

    this.levels = levels;
    this.level_index = index;
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
    this.game.load.tilemap('map', this.levels[this.level_index].tilemap, null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/tilemaps/tiles/gridtiles.png');

  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('gridtiles', 'tiles');

    // this.groundLayer = this.map.createLayer('Ground');
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

    if (this.st.has_key) {
      var result = this.findObjectsByType('key', this.map, 'Objects');
      this.key = this.game.add.sprite(result[0].x, result[0].y, 'key');
      this.game.physics.enable(this.key, Phaser.Physics.ARCADE);
    }

    var results = this.findObjectsByType('portalN', this.map, 'Objects');
    this.portals_n = [];
    for(var i in results) {
      var portal = this.game.add.sprite(results[i].x, results[i].y, 'portal');
      this.portals_n.push(portal);
      this.game.physics.enable(portal, Phaser.Physics.ARCADE);
    }
    var results = this.findObjectsByType('portalE', this.map, 'Objects');
    this.portals_e = [];
    for(var i in results) {
      var portal = this.game.add.sprite(results[i].x, results[i].y, 'portal');
      this.portals_e.push(portal);
      this.game.physics.enable(portal, Phaser.Physics.ARCADE);
    }
    var results = this.findObjectsByType('portalS', this.map, 'Objects');
    this.portals_s = [];
    for(var i in results) {
      var portal = this.game.add.sprite(results[i].x, results[i].y, 'portal');
      this.portals_s.push(portal);
      this.game.physics.enable(portal, Phaser.Physics.ARCADE);
    }
    var results = this.findObjectsByType('portalW', this.map, 'Objects');
    this.portals_w = [];
    for(var i in results) {
      var portal = this.game.add.sprite(results[i].x, results[i].y, 'portal');
      this.portals_w.push(portal);
      this.game.physics.enable(portal, Phaser.Physics.ARCADE);
    }

    var result = this.findObjectsByType('player', this.map, 'Objects');
    this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
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
    this.game.physics.arcade.overlap(this.player, this.portals_n, this.enterPortalN, null, this);
    this.game.physics.arcade.overlap(this.player, this.portals_e, this.enterPortalE, null, this);
    this.game.physics.arcade.overlap(this.player, this.portals_s, this.enterPortalS, null, this);
    this.game.physics.arcade.overlap(this.player, this.portals_w, this.enterPortalW, null, this);
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

  toLevel(index) {
    this.state.start('Game' + index, true, false, this.levels, index);
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
    this.key.destroy()
    this.toLevel(newlvl)
  }

  enterPortalN(player, portal) { this.enterPortal(player, portal, 0) }
  enterPortalE(player, portal) { this.enterPortal(player, portal, 1) }
  enterPortalS(player, portal) { this.enterPortal(player, portal, 2) }
  enterPortalW(player, portal) { this.enterPortal(player, portal, 3) }
}

