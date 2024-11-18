class Resources {
    constructor() {
        this.toLoad = {
            tiles: "sprites/RoguelikeStarter.png"
        };
        this.images = {};
        Object.keys(this.toLoad).forEach(k => {
            const img = new Image();
            img.src = this.toLoad[k];
            this.images[k] = {
                image: img,
                isLoaded: false
            };
            img.onload = () => {
                this.images[k].isLoaded = true;
            };
        });
    }
} // end class Resources

var global = window || global;
global.Resources = new Resources();
