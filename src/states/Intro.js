import Phaser from 'phaser';

export default class extends Phaser.State {
    init () {
        this.introCompleted = false
    }

    create () {
        const text = 'In a world where teleportation\nis used to travel any distance.\n' +
        '\n' +
        'A father wants to take his son with him to\nthe "bring your son to office" day.\n' +
        'As they both teleported they got separated\nand his son was lost in the way\nto the desired destination.\n'
        '\n' +
        'Your mission is to find your\nson and go to work.';


        this.game.stage.backgroundColor = 0x272822;
        this.introText = this.add.text(
            this.camera.centerX - 25,
            this.camera.height,
            text,
            {
                font: '44px Bangers',
                fill: '#e5e817',
                smoothed: false,
                align: 'center'
            })

        this.introText.anchor.setTo(0)
        this.introText.wordWrap = false
        this.introText.setTextBounds(25, 25, this.camera.width - 25, this.camera.height);
        this.introText.width = this.camera.width - 50

        this.spacebarKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }

    update() {

        if (this.spacebarKey.isDown)
        {
            this.state.start('Game0', true, false, 0)
        }

        if (this.introText && (this.introText.inCamera || this.introText.position.y > 0))
        {
            this.introText.position.y -= 2
        }
        else if (this.introText && this.introText.position.y < 0)
        {
            this.introText.destroy()
            this.introCompleted = true
        }

        if (this.introCompleted)
        {
            this.state.start('Game0', true, false, 0)
        }
    }
}
