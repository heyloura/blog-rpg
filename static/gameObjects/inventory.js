class Inventory extends GameObject {
    constructor() {
        super({
            position: new Vector2(0, 1)
        });

        this.nextId = 0;
        this.items = [{
            id: -1,
            image: global.Resources.images.wand
        }];

        global.GameEvents.on("HERO_PICKS_UP_ITEM", this, data => { 
            this.nextId += 1;
            this.items.push({
                id: this.nextId,
                image: global.Resources.images.wand 
            });
            this.renderInventory();
        });

        this.renderInventory();
    }

    removeFromInventory(id) {
        this.items = this.items.filter(item => item.id != id);
        this.renderInventory();
    }

    renderInventory() {
        this.children.forEach(child => child.destroy())

        this.items.forEach((item, index) => {
            const sprite = new Sprite({
                resource: item.image,
                position: new Vector2(index*12, 0)
            });
            this.addChild(sprite);
        });
    }
}

var global = window || global;
global.Inventory = Inventory;
