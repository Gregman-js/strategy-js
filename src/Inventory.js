import {$, $$} from './Utils.js';
import Texture from "./Texture.js";
import StructurePrice from "./StructurePrice.js";

export default class Inventory {
    static inventoryX = 6;
    static inventoryY = 7;
    static resources = {
        'wood': 50,
        'stone': 50,
        'money': 0,
    };
    static game = null;

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

        Inventory.updateResources();
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
        for (let i = 0; i < initialInventory.length; i++) {
            const field = initialInventory[i];
            const item = inventoryItems[i];
            const img = document.createElement('img');
            img.classList.add('w-100');
            img.style.pointerEvents = 'none';
            img.src = Texture.getTextureUrl(field);
            item.dataset.field = field;
            item.classList.add('item-clickable');
            item.addEventListener("click", ev => {
                if (StructurePrice.canBuy(field, Inventory.resources)) {
                    Inventory.game.toggleAddStructureMode(field);
                } else {
                    alert('Can\'t buy');
                }
            });
            item.dataset.toggle = 'tooltip';
            item.dataset.placement = 'top';
            item.title = StructurePrice.serialize(field);
            new bootstrap.Tooltip(item)
            item.append(img);
        }
    }

    static decreaseResourcesFromField(field) {
        Inventory.resources = StructurePrice.decreaseBy(Inventory.resources, field);
        Inventory.updateResources();
    }

    static updateResources() {
        const resourceWrapper = $('.main-panel-resources-items-wrapper');
        resourceWrapper.innerHTML = '';

        for (const name in Inventory.resources) {
            const item = document.createElement('div');
            item.classList.add('main-panel-resources-item');
            item.classList.add('text-secondary');
            item.dataset.resourceName = name;
            const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
            item.innerHTML = capitalized + ': ' + '<span class="value text-white">' + Inventory.resources[name] + '</span>';
            resourceWrapper.append(item);
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
            fieldItem.classList.remove('item-clickable');
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
