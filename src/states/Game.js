/* globals __DEV__ */
import Phaser from 'phaser'
import Inventory from '../models/inventory/inventory'
import Item from '../models/inventory/item'


var levels

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


  init (index, direction) {

    levels = window.TheLostSon.levels
    this.velo = 250;
    this.direction = direction

    if (this.loaded != true) {
      this.first = true;
    } else {
      this.first = false;
    }

    this.loaded = true;

    this.level_index = index;
  }

  preload () {
    this.game.load.spritesheet('player', './assets/images/player.png', 32, 32);
    this.game.load.spritesheet('portal', './assets/images/portal.png', 32, 32);
    this.game.load.spritesheet('chest_closed', './assets/images/chest_closed.png', 32, 32);
    this.game.load.spritesheet('chest_open', './assets/images/chest_open.png', 32, 32);

    this.game.load.spritesheet('ice_cream', './assets/images/ice_cream.png', 32, 32);
    this.game.load.spritesheet('key', './assets/images/key.png', 32, 32);
    this.game.load.spritesheet('scissor', './assets/images/scissor.png', 32, 32);

    this.game.load.spritesheet('star_with_power', './assets/images/star_with_power.png', 32, 32);
    this.game.load.spritesheet('star_with_key', './assets/images/star_with_key.png', 32, 32);
    
    this.game.load.tilemap('map', levels[this.level_index].tilemap, null, Phaser.Tilemap.TILED_JSON);
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

    var result = this.findObjectsByType('ice_cream', this.map, 'Objects');
    this.ice_cream = this.game.add.sprite(result[0].x, result[0].y, 'ice_cream');
    this.game.physics.enable(this.ice_cream, Phaser.Physics.ARCADE);

    var result = this.findObjectsByType('chest', this.map, 'Objects');
    if (window.TheLostSon.playerInventory.keyUsed) {
      this.chest = this.game.add.sprite(result[0].x, result[0].y, 'chest_open');
    } else {
      this.chest = this.game.add.sprite(result[0].x, result[0].y, 'chest_closed');
    }
    this.game.physics.enable(this.chest, Phaser.Physics.ARCADE);
    this.chest.body.immovable = true;

    let currentInventoryItem = window.TheLostSon.playerInventory.getInventoryItem();
    if (!window.TheLostSon.playerInventory.keyUsed &&
      (currentInventoryItem == null ||
      !currentInventoryItem.isKey())) {
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
    var rotation;
    if ((result.length != 0) && this.first) {
      posx = result[0].x
      posy = result[0].y
      rotation = 0;
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
        rotation = 270;
      } else if (this.direction == 1) {
        portalpos = this.portal_w.position
        addx = diff;
        addy = 0;
        rotation = 0;
      } else if (this.direction == 2) {
        portalpos = this.portal_n.position
        addx = 0;
        addy = diff;
        rotation = 90;
      } else {
        portalpos = this.portal_e.position
        addx = -diff;
        addy = 0;
        rotation = 180;
      }


      posx = portalpos.x + addx
      posy = portalpos.y + addy
    }

    currentInventoryItem = window.TheLostSon.playerInventory.getInventoryItem();
    if (currentInventoryItem != null && currentInventoryItem.isKey()) {
      this.player = this.game.add.sprite(posx, posy, 'star_with_key');
    } else {
      this.player = this.game.add.sprite(posx, posy, 'player');
    }

    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.anchor.setTo(0.5, 0.5)


    this.player.has_ice_cream = false;
    this.player.body.collideWorldBounds = true;

    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.player.angle = rotation;
    // this.groundLayer.resizeWorld();
  }

  update() {
    // this.game.physics.arcade.collide(this.sprite, this.groundLayer);
    this.game.physics.arcade.collide(this.player, this.collisionLayer);
    // this.game.physics.arcade.collide(this.player, this.chest);

    this.game.physics.arcade.overlap(this.player, this.ice_cream, this.collectIceCream, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal_n, this.enterPortalN, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal_e, this.enterPortalE, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal_s, this.enterPortalS, null, this);
    this.game.physics.arcade.overlap(this.player, this.portal_w, this.enterPortalW, null, this);
    this.game.physics.arcade.overlap(this.player, this.key, this.collectKey, null, this);
    this.game.physics.arcade.overlap(this.player, this.chest, this.openChest, null, this);

    this.player.body.maxVelocity.setTo(this.velo, this.velo);

    if(this.cursors.up.isDown || this.cursors.down.isDown) {
        if(this.cursors.up.isDown) {
            this.player.body.acceleration.y -= this.velo;
        }
        if(this.cursors.down.isDown) {
            this.player.body.acceleration.y += this.velo;
        }
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
    if(this.cursors.left.isDown || this.cursors.right.isDown) {
        if(this.cursors.left.isDown) {
            this.player.body.acceleration.x -= this.velo;
        }
        if(this.cursors.right.isDown) {
            this.player.body.acceleration.x += this.velo;
        }
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

  collectIceCream(player, ice_cream) {
    ice_cream.destroy();

    this.player.has_ice_cream = true;
    this.player.loadTexture('star_with_power', 0);
    this.velo = 200;
  }

  openChest(player, chest) {

    let currentInventoryItem = window.TheLostSon.playerInventory.getInventoryItem()
    if(!window.TheLostSon.playerInventory.keyUsed &&
      currentInventoryItem != null &&
      currentInventoryItem.isKey()) {
      this.chest.loadTexture('chest_open', 0);

      window.TheLostSon.playerInventory.useKeyOnChest();

      window.TheLostSon.playerInventory.receiveHedgeTrimmer();
      player.loadTexture('player', 0);
    }
  }

  collectKey(player, key) {
    if (window.TheLostSon.playerInventory.carriesItem()) {
      return;
    }

    key.destroy();
    window.TheLostSon.playerInventory.findKey();

    this.player.loadTexture('star_with_key', 0);
  }

  toLevel(index, direction) {
    this.state.start('Game' + index, true, false, index, direction);
  }

  enterPortal(player, portal, direction) {
    var newlvl;
    if (direction == 0) {
      newlvl = levels[this.level_index].exits['N'];
    } else if (direction == 1) {
      newlvl = levels[this.level_index].exits['E'];
    } else if (direction == 2) {
      newlvl = levels[this.level_index].exits['S'];
    } else {
      newlvl = levels[this.level_index].exits['W'];
    }
    newlvl -= 1; // zero indexing
    this.toLevel(newlvl, direction)
  }

  rotatePlayer(x, y, accX, accY) {
    var rad = Math.atan2(y, x);
    var deg = rad * (180 / Math.PI);
    if (x !== 0 || y !== 0) {
      this.player.angle = deg;
    }
  }

  enterPortalN(player, portal) { this.enterPortal(player, portal, 0) }
  enterPortalE(player, portal) { this.enterPortal(player, portal, 1) }
  enterPortalS(player, portal) { this.enterPortal(player, portal, 2) }
  enterPortalW(player, portal) { this.enterPortal(player, portal, 3) }
}
