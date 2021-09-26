import {$} from "./Utils.js";
import Texture from "./Texture.js";
import Terrain from "./Terrain.js";
import Inventory from "./Inventory.js";

export default class Game {
    canvasSelector = '.game-canvas';
    wrapperSelector = '.game-canvas-wrapper';

    init() {
        this.canvas = $(this.canvasSelector);
        const wrapperProps = $(this.wrapperSelector).getBoundingClientRect();
        this.width = wrapperProps.width;
        this.height = wrapperProps.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.terrain = new Terrain(this);
        this.canvas.addEventListener('drop', ev => this.dropItem(ev));
        this.canvas.addEventListener('dragover', ev => {
            ev.preventDefault();
        });
        Texture.initTextures(() => {
            this.terrain.generate();
        });

        Inventory.loadInitialStructures({
            'mine-rock': 4,
            'mine-tree': 4,
        });

        requestAnimationFrame(this.update.bind(this));
    }

    dropItem(ev) {
        ev.preventDefault();
        const fieldName = ev.dataTransfer.getData("text/plain");
        const dropX = (ev.clientX - ev.clientX % Terrain.UNIT_SIZE) / Terrain.UNIT_SIZE;
        const dropY = (ev.clientY - ev.clientY % Terrain.UNIT_SIZE) / Terrain.UNIT_SIZE;
        this.terrain.addFieldAt(fieldName, dropX, dropY);
        Inventory.decreaseItem(fieldName, 1);
    }

    update() {
        this.terrain.update();
        this.terrain.render();
        requestAnimationFrame(this.update.bind(this));
    }
}
