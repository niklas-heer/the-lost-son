import Item from './item'

let currentItem = null
let sonPowerUp = null

export default class Inventory {
  constructor() {
    this.keyUsed = false
  }

  collectIcecream() {
    if (this.carriesItem()) {
      throw `Already carring item '${currentItem.name}'`
    }

    currentItem = new Item('Icecream', [ 'GrumpySon' ])
  }

  collectKey() {
    if (this.carriesItem()) {
      throw `Already carring item '${currentItem.name}'`
    }

    currentItem = new Item('Key', [ 'GrumpySon' ])
  }

  findKey() {
    if (this.carriesItem()) {
      throw `Already carring item '${currentItem.name}'`
    }

    currentItem = new Item('Key', [ 'Chest' ])
  }

  receiveHedgeTrimmer() {
    if (this.carriesItem()) {
      throw `Already carring item '${currentItem.name}'`
    }

    console.warn('Collected \'HedgeTrimmer\' but no display so far')
    currentItem = new Item('HedgeTrimmer', [ 'Hedge' ])
  }

  getDownBatterie() {
    if (this.carriesItem()) {
      throw `Already carring item '${currentItem.name}'`
    }

    currentItem = new Item('Batterie', [ 'Portal' ])
  }

  convinceSon() {
    if (sonPowerUp != null ||
      currentItem == null ||
      !currentItem.isIcecream()) {
      throw `Icecream is needed to convice your son`
    }

    sonPowerUp = new Item('Son', [ 'Shelve' ])
  }

  isSonWithYou() {
    return sonPowerUp != null
  }

  carriesItem() {
    return currentItem !== null
  }

  getInventoryItem() {
    return currentItem
  }

  useKeyOnChest() {
    if (this.keyUsed) {
      throw 'They \'Key\' was already used.'
    }

    if (currentItem === null || !currentItem.isKey()) {
      throw 'They item \'Key\' is required to open the chest'
    }

    this.keyUsed = true
    currentItem = null
  }

  eatIcecream() {
    if (currentItem == null || !currentItem.isIcecream()) {
      throw 'You need icecream to eat it'
    }

    currentItem = null
  }

  dropInventoryItem() {
      let tempItemToDrop = currentItem

      currentItem = null

      return tempItemToDrop
  }
}
