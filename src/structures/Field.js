import Texture from "../Texture.js";
import Terrain from "../Terrain.js";
import Inventory from "../Inventory.js";

export default class Field {
    x;
    y;
    size = 4;
    ctx;
    name;
    drawReact = false;
    resource = null;
    renderStructure = true;

    constructor(x, y, ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.name = null;
    }

    moveTo(pos) {
        this.x = pos[0] / Terrain.UNIT_SIZE;
        this.y = pos[1] / Terrain.UNIT_SIZE;
    }

    normalizePos() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
    }

    update() {
        if (this.resource !== null) {
            this.resource.update();
        }
    }

    render() {
        if (!this.renderStructure) {
            return;
        }
        this.ctx.drawImage(
            Texture.getTexture(this.name),
            this.x * Terrain.UNIT_SIZE,
            this.y * Terrain.UNIT_SIZE,
            this.size * Terrain.UNIT_SIZE,
            this.size * Terrain.UNIT_SIZE
        );

        if (this.drawReact) {
            this.ctx.strokeStyle = 'rgb(42,42,42)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                this.x * Terrain.UNIT_SIZE,
                this.y * Terrain.UNIT_SIZE,
                this.size * Terrain.UNIT_SIZE,
                this.size * Terrain.UNIT_SIZE
            );
        }

        if (this.resource !== null) {
            this.resource.render(this.ctx, this.x, this.y, this.size);
        }
    }
}
