class Wand extends GameObject {
    constructor(x,y) {
        super({position: new Vector2(x,y)});

        const sprite = new Sprite({
            resource: global.Resources.images.wand,
            position: new Vector2(0,-5)
        })

        this.addChild(sprite);
    }

    ready() {
        global.GameEvents.on("HERO_POSITION", this, pos => {
            const roundedHeroX = Math.round(pos.x);
            const roundedHeroY = Math.round(pos.y);

            if(roundedHeroX === this.position.x && roundedHeroY === this.position.y) {
                this.onCollideWithHero();
            }
        });
    }

    onCollideWithHero() {
        this.destroy();

        global.GameEvents.emit("HERO_PICKS_UP_ITEM", {
            image: global.Resources.images.wand,
            position: this.position
        })
    }
}
