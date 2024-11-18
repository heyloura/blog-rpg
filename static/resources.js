class Resources {
    constructor() {
        this.toLoad = {
            tiles: "RoguelikeStarter.png",
            hero: "hero-sheet.png",
            shadow: "shadow.png",
            wand: "rod.png"
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
