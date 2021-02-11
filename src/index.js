import Phaser from 'phaser';
// import logoImg from './assets/logo.png';
import Login from './scenes/login'
import Loader from './scenes/loader'
import Game from './scenes/game'

// class MyGame extends Phaser.Scene
// {
//     constructor ()
//     {
//         super();
//     }

//     preload ()
//     {
//         this.load.image('logo', logoImg);
//     }

//     create ()
//     {
//         const logo = this.add.image(400, 150, 'logo');

//         this.tweens.add({
//             targets: logo,
//             y: 450,
//             duration: 2000,
//             ease: "Power2",
//             yoyo: true,
//             loop: -1
//         });
//     }
// }

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    dom: {
      createContainer: true,
    },
    width: 1280,
    height: 720,
    scene: [Login, Loader, Game]
};

const game = new Phaser.Game(config);
