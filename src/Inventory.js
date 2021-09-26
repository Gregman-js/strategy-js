import {$, $$} from './Utils.js';
import Texture from "./Texture.js";

export default class Inventory {
    static inventoryX = 6;
    static inventoryY = 7;
    static resources = {
        'wood': 0,
        'stone': 0,
        'money': 0,
    };

    static init() {
        const inventoryWrapper = $('.main-panel-inventory');

        const row = document.createElement('div');
        row.classList.add('row');
        for (let y = 0; y < Inventory.inventoryY; y++) {
            for (let x = 0; x < Inventory.inventoryX; x++) {
                const item = this.item();
                row.append(item)
            }
        }
        inventoryWrapper.append(row);

        const resourceWrapper = $('.main-panel-resources-items-wrapper');

        for (const name in Inventory.resources) {
            const item = document.createElement('div');
            item.classList.add('main-panel-resources-item');
            item.classList.add('text-secondary');
            item.dataset.resourceName = name;
            const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
            item.innerHTML = capitalized + ': ' + '<span class="value text-white">0</span>';
            resourceWrapper.append(item);
        }
    }

    static item() {
        const col = document.createElement('div');
        col.classList.add('col-2');
        col.classList.add('px-0');
        col.classList.add('main-panel-inventory-item');

        return col;
    }

    static loadInitialStructures(initialInventory) {
        const inventoryItems = $$('.main-panel-inventory-item');
        for (const item of inventoryItems) {
            let itemInside = false;
            for (const field in initialInventory) {
                if (initialInventory[field] > 0 && !itemInside) {
                    const img = document.createElement('img');
                    img.classList.add('w-100');
                    img.src = Texture.getTextureUrl(field);
                    item.dataset.field = field;
                    item.innerHTML += '<div class="main-panel-inventory-item-count">' + initialInventory[field] + '</div>';
                    initialInventory[field] = 0;
                    item.classList.add('item-draggable');
                    img.draggable = true;
                    img.addEventListener("dragstart", ev => {
                        ev.dataTransfer.setData("text/plain", field);
                    });
                    item.append(img);
                    itemInside = true;
                }
            }
        }
    }

    static decreaseItem(field, num) {
        const fieldItem = $('.main-panel-inventory-item[data-field=' + field + ']');
        if (null === fieldItem) {
            return;
        }

        const countItem = fieldItem.querySelector('.main-panel-inventory-item-count');
        const newCount = parseInt(countItem.innerText) - num;
        countItem.innerText = newCount;
        if (newCount <= 0) {
            fieldItem.querySelector('img').draggable = false;
            fieldItem.classList.remove('item-draggable');
        }
    }

    static addResources(name, quantity) {
        if (!(name in Inventory.resources)) {
            return;
        }

        const item = $('.main-panel-resources-item[data-resource-name="' + name + '"]');
        if (item) {
            Inventory.resources[name] += quantity;
            item.querySelector('.value').innerHTML = Inventory.resources[name];
        }
    }
}
