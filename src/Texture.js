export default class Texture {
    static URLS = {
        'grass': 'grass.jpg',
        'fortress': 'fortress.jpg',
        'mine-tree': 'mine-tree.jpg',
        'mine-rock': 'mine-rock.jpg',
    };

    static textureMap = {};
    static textureLoaded = [];
    static callback = () => {};

    static initTextures(callback = () => {}) {
        Texture.callback = callback;

        for (const field in Texture.URLS) {
            const img = new Image();
            img.src = 'img/fields/' + Texture.URLS[field];
            img.onload = () => {
                Texture.textureLoaded.push(field);
                Texture.checkLoadingCompleted();
            };
            Texture.textureMap[field] = img;
        }
    }

    static checkLoadingCompleted() {
        if (
            Texture.textureLoaded.length >= Object.keys(Texture.URLS).length
            && typeof Texture.callback === 'function'
        ) {
            Texture.callback();
        }
    }

    static getTexture(field) {
        return Texture.textureMap[field];
    }

    static getTextureUrl(field) {
        return 'img/fields/' + Texture.URLS[field];
    }
}
