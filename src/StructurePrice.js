export default class StructurePrice {
    static price = {
        'mine-rock': {
            'wood': 10,
            'stone': 20
        },
        'mine-tree': {
            'wood': 40,
            'stone': 10
        },
    };

    static getPrice(field) {
        return StructurePrice.price[field];
    }

    static serialize(field) {
        const price = StructurePrice.getPrice(field);
        let text = '';
        for (const resource in price) {
            text += resource.charAt(0).toUpperCase() + resource.slice(1) + ': ' + price[resource] + ', ';
        }
        return text.substring(0, text.length - 2);
    }

    static decreaseBy(resources, field) {
        const price = StructurePrice.getPrice(field);

        for (const resource in price) {
            resources[resource] = resources[resource] - price[resource];
        }
        return resources;
    }

    static canBuy(field, resources) {
        const price = StructurePrice.getPrice(field);

        for (const resource in price) {
            if (price[resource] > resources[resource]) {
                return false;
            }
        }

        return true;
    }
}
