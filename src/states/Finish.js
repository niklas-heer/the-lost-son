import Phaser from 'phaser';

export default class extends Phaser.State {
    init () {
        this.introCompleted = false
    }
    preload () {
        this.game.load.spritesheet('fatherson', './assets/images/fatherson.jpg');
    }

    create () {
        const text = 'Father found his son again\n and teleported to the office.\n\n They are now reunited\n in front of a game console\n and gamble a game.';


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
    
        this.finpic = this.game.add.sprite(0, this.game.height, 'fatherson');

        this.spacebarKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }

    update() {

        if (this.spacebarKey.isDown)
        {
            window.location.reload();
        }

        if (this.introText && this.introText.position.y > -200)
        {
            console.log(this.introText.position.y);
            this.introText.position.y -= 2
            if (this.introText.position.y + this.introText.height + 25 < this.game.height) 
            {
                this.finpic.position.y -= 2
            }
        }
    }
}
