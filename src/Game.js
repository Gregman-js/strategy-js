import {$} from "./Utils.js";
import Texture from "./Texture.js";
import Terrain from "./Terrain.js";
import Inventory from "./Inventory.js";

export default class Game {
    canvasSelector = '.game-canvas';
    wrapperSelector = '.game-canvas-wrapper';
    mousePointer = null;
    trackMouse = false;

    init() {
        this.canvas = $(this.canvasSelector);
        const wrapperProps = $(this.wrapperSelector).getBoundingClientRect();
        this.width = wrapperProps.width;
        this.height = wrapperProps.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        this.terrain = new Terrain(this);
        Texture.initTextures(() => {
            this.terrain.generate();
        });
        Inventory.game = this;
        Inventory.loadInitialStructures(['mine-rock', 'mine-tree']);

        this.canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
        this.canvas.addEventListener('click', this.mouseClickHandler.bind(this));

        requestAnimationFrame(this.update.bind(this));
    }

    mouseMoveHandler(event) {
        if (!this.trackMouse) {
            return;
        }
        this.mousePointer = [event.clientX, event.clientY];
    }

    mouseClickHandler(event) {
        if (this.trackMouse && this.terrain.editMode) {
            this.terrain.droppingField.normalizePos();
            const x = this.terrain.droppingField.x;
            const y = this.terrain.droppingField.y;
            this.terrain.fields[x + 'x' + y] = this.terrain.droppingField;
            this.trackMouse = false;
            this.terrain.disableEditMode();
            Inventory.decreaseResourcesFromField(this.terrain.droppingField.name);
            this.terrain.droppingField = null;
            this.mousePointer = null;
        }
    }

    toggleAddStructureMode(field) {
        let newObj = this.terrain.createFromField(field, 0, 0);
        newObj.renderStructure = false;
        this.terrain.droppingField = newObj;
        this.trackMouse = true;
        this.terrain.enableEditMode();

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
