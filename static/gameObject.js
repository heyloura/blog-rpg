class GameObject {
    constructor({position}) {
        this.position = position ?? new Vector2(0,0);
        this.children = [];
        this.parent = null;
        this.hasReadyBeenCalled = false;
    } 

    // first entry point
    stepEntry(delta, root) {
        //updates on children first
        this.children.forEach((child) => child.stepEntry(delta, root));

        //call ready on the first frame
        if(!this.hasReadyBeenCalled) {
            this.hasReadyBeenCalled = true;
            this.ready();
        }

        //call any implemented Step code
        this.step(delta, root);
    }

    // called once every frame
    step(_delta) {

    }

    draw(ctx, x, y) {
        const drawPosX = x + this.position.x;
        const drawPosY = y + this.position.y;

        this.drawImage(ctx, drawPosX, drawPosY);

        this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
    }

    drawImage(ctx, drawPosX, drawPosY) {

    }

    destroy() {
        this.children.forEach(child => { child.destroy() });
        this.parent.removeChild(this);
    }

    addChild(gameObject) {
        gameObject.parent = this;
        this.children.push(gameObject);
    }

    removeChild(gameObject) {
        global.GameEvents.unsubscribe(gameObject);
        this.children = this.children.filter(g => {return gameObject != g});
    }

    // called before the first step
    ready() {
        // ...
    }

} // end GameObject class
