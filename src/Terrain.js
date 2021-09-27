import Grass from "./structures/Grass.js";
import Fortress from "./structures/Fortress.js";
import MineRock from "./structures/MineRock.js";
import MineTree from "./structures/MineTree.js";

export default class Terrain {
    static STRUCTURE_SIZE = 60;
    static UNIT_SIZE = 15;
    fields = {};
    editMode = false;
    droppingField = null;

    constructor(game) {
        this.game = game;
        this.ctx = this.game.ctx;
    }

    addFieldAt(field, x, y) {
        let obj = this.createFromField(field, x, y);

        if (null === obj) {
            return;
        }

        this.fields[x + 'x' + y] = obj;
        obj.render();
    }

    createFromField(field, x, y) {
        let obj = null;
        switch (field) {
            case 'grass':
                obj = new Grass(x, y, this.ctx);
                break;
            case 'fortress':
                obj = new Fortress(x, y, this.ctx);
                break;
            case 'mine-rock':
                obj = new MineRock(x, y, this.ctx);
                break;
            case 'mine-tree':
                obj = new MineTree(x, y, this.ctx);
                break;
            default:
                return null;
        }

        return obj;
    }

    isStructure(fieldPos) {
        return typeof this.fields[fieldPos] === "object" && !Array.isArray(this.fields[fieldPos]);
    }

    isEmptyField(fieldPos) {
        return typeof this.fields[fieldPos] === "undefined";
    }

    enableEditMode() {
        this.editMode = true;
    }
    disableEditMode() {
        this.editMode = false;
    }

    generate() {
        for (let y = 0; y < this.game.height / Terrain.UNIT_SIZE; y++) {
            for (let x = 0; x < this.game.width / Terrain.UNIT_SIZE; x++) {
                if (!this.isEmptyField(x + 'x' + y)) {
                    continue;
                }

                const grass = new Grass(x, y, this.ctx);
                const marginX = grass.size;
                const marginY = grass.size;
                this.fields[x + 'x' + y] = grass;

                for (let mx = 0; mx < marginX; mx++) {
                    for (let my = 0; my < marginY; my++) {
                        if (mx === 0 && my === 0) {
                            continue;
                        }

                        this.fields[(x + mx) + 'x' + (y + my)] = [x, y];
                    }
                }
                grass.render();
            }
        }

        const centerX = Math.floor(this.game.width / Terrain.UNIT_SIZE / 2);
        const centerY = Math.floor(this.game.height / Terrain.UNIT_SIZE / 2);

        const fortress = new Fortress(centerX, centerY, this.ctx);
        this.fields[centerX + 'x' + centerY] = fortress;
        fortress.render();
    }

    update() {
        for (const field in this.fields) {
            if (this.isStructure(field)) {
                this.fields[field].update();
            }
        }

        if (this.editMode && null !== this.droppingField && null !== this.game.mousePointer) {
            this.droppingField.renderStructure = true;
            this.droppingField.moveTo(this.game.mousePointer);
        }
    }
    render() {
        for (const field in this.fields) {
            if (this.isStructure(field) && this.fields[field].name === 'grass') {
                this.fields[field].render();
            }
        }


        if (this.editMode) {
            this.renderEditLines();
        }

        for (const field in this.fields) {
            if (this.isStructure(field) && this.fields[field].name !== 'grass') {
                this.fields[field].render();
            }
        }

        if (this.editMode && null !== this.droppingField && null !== this.game.mousePointer) {
            this.droppingField.render();
        }
    }

    renderEditLines() {
        for (let y = 1; y < this.game.height / Terrain.UNIT_SIZE; y++) {
            this.ctx.strokeStyle = 'rgb(42,86,98)';
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * Terrain.UNIT_SIZE);
            this.ctx.lineTo(this.game.width, y * Terrain.UNIT_SIZE);
            this.ctx.stroke();
        }
        for (let x = 1; x < this.game.width / Terrain.UNIT_SIZE; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * Terrain.UNIT_SIZE, 0);
            this.ctx.lineTo(x * Terrain.UNIT_SIZE, this.game.height);
            this.ctx.stroke();
        }
    }
}
