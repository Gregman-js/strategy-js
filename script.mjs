import Inventory from './src/Inventory.js';
import Game from './src/Game.js';

function init() {
    Inventory.init();
    const game = new Game();
    game.init();
}


document.addEventListener("DOMContentLoaded", init);
