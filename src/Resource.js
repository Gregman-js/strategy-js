import Inventory from "./Inventory.js";
import Terrain from "./Terrain.js";

export default class Resource {
    name;
    quantity;
    startTime = null;
    time;
    color;
    constructor(name, quantity, time, color) {
        this.color = color;
        this.name = name;
        this.quantity = quantity;
        this.time = time;
    }

    update() {
        if (this.startTime === null) {
            this.startTime = performance.now();
        } else if ((performance.now() - this.startTime) / 1000 > this.time) {
            this.startTime = null;
            Inventory.addResources(this.name, this.quantity);
        }
    }

    render(ctx, x, y, size) {
        if (this.startTime === null) {
            return;
        }

        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'rgb(14,14,14)';
        ctx.lineWidth = 1;
        const proc = ((performance.now() - this.startTime) / 1000) / this.time;
        ctx.fillRect(
            x * Terrain.UNIT_SIZE,
            y * Terrain.UNIT_SIZE - 10,
            size * Terrain.UNIT_SIZE * proc,
            5
        );
        ctx.strokeRect(
            x * Terrain.UNIT_SIZE,
            y * Terrain.UNIT_SIZE - 11,
            size * Terrain.UNIT_SIZE,
            7
        );
    }

}
