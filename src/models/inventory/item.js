export default class Item {
  constructor(name, unlockables) {
    this.name = name
    this.unlockables = unlockables
  }

  canUnlock(objectiveName) {
    this.unlockables.find((unlockable) => {
      return unlockable === objectiveName
    });
  }

  isKey() {
    return this.name === 'Key'
  }

  isIcecream() {
    return this.name === 'Icecream'
  }

  isHedgeTrimmer() {
    return this.name === 'HedgeTrimmer'
  }

  isBatterie() {
    return this.name === 'Batterie'
  }
}
