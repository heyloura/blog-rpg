const makeWalkingFrames = (rootFrame = 0) => {
return {
    duration: 400,
    frames: [
        {time: 0, frame: rootFrame + 1 },
        {time: 100, frame: rootFrame },
        {time: 200, frame: rootFrame + 1 },
        {time: 300, frame: rootFrame + 2 },
    ]
}
}

const WALK_DOWN =  makeWalkingFrames(0);
const WALK_RIGHT =  makeWalkingFrames(3);
const WALK_UP =  makeWalkingFrames(6);
const WALK_LEFT =  makeWalkingFrames(9);

const makeStandingFrames = (rootFrame = 0) => {
return {
    duration: 400,
    frames: [
        {time: 0, frame: rootFrame }
    ]
}
}

const STAND_DOWN =  makeStandingFrames(1);
const STAND_RIGHT =  makeStandingFrames(4);
const STAND_UP =  makeStandingFrames(7);
const STAND_LEFT =  makeStandingFrames(10);

const PICK_UP_DOWN = {
    duration: 400,
    frames: [
        { time: 0, frame: 12 }
    ]
}

class Hero extends GameObject {
    constructor(x,y) {
        super({
            position: new Vector2(x,y)
        });

        const shadow = new Sprite({
            resource: global.Resources.images.shadow,
            frameSize: new Vector2(32,32),
            position: new Vector2(-8,-19)
        });
        this.addChild(shadow);

        this.body = new Sprite({
            resource: global.Resources.images.hero,
            frameSize: new Vector2(32,32),
            yFrames: 8,
            xFrames: 3,
            frame: 1,
            position: new Vector2(-8, -20),
            animations: new Animations({
                walkDown: new FrameIndexPattern(WALK_DOWN),
                walkLeft: new FrameIndexPattern(WALK_LEFT),
                walkRight: new FrameIndexPattern(WALK_RIGHT),
                walkUp: new FrameIndexPattern(WALK_UP),
                standDown: new FrameIndexPattern(STAND_DOWN),
                standLeft: new FrameIndexPattern(STAND_LEFT),
                standRight: new FrameIndexPattern(STAND_RIGHT),
                standUp: new FrameIndexPattern(STAND_UP),
                pickUpDown: new FrameIndexPattern(PICK_UP_DOWN)
            })
        });

        this.addChild(this.body);
        this.facingDirection = DOWN;
        this.destinationPostion = this.position.duplicate();
        this.itemPickUpTime = 0;
        this.itemPickUpShell = null;

        global.GameEvents.on("HERO_PICKS_UP_ITEM", this, data => { this.onPickUpItem(data) })
    }

    step(delta, root) {

        if(this.itemPickUpTime > 0) {
            this.workOnItemPickup(delta);
            return;
        }

        const distance = moveTowards(this, this.destinationPostion, 1);
        const hasArrived = distance <= 1;
        if(hasArrived) {
            this.tryMove(root);
        }

        this.tryEmitPosition();
    }

    tryEmitPosition() {
        if(this.lastX == this.position.x && this.lastY === this.position.y) {
            return;
        }

        this.lastX = this.position.x;
        this.lastY = this.position.y;

        global.GameEvents.emit("HERO_POSITION", this.position);
    }

    tryMove(root) {
        const {input} = root;

        if(!input.direction) {

            if(this.facingDirection === LEFT) {this.body.animations.play("standLeft")}
            if(this.facingDirection === RIGHT) {this.body.animations.play("standRight")}
            if(this.facingDirection === UP) {this.body.animations.play("standUp")}
            if(this.facingDirection === DOWN) {this.body.animations.play("standDown")}

            return;
        }

        let nextX = this.destinationPostion.x;
        let nextY = this.destinationPostion.y;
        let gridSize = 16;
        
        if(input.direction === DOWN) {
            nextY += gridSize;
            this.body.animations.play("walkDown");
        }
        if(input.direction === UP) {
            nextY -= gridSize;
            this.body.animations.play("walkUp");
        }
        if(input.direction === LEFT) {
            nextX -= gridSize;
            this.body.animations.play("walkLeft");
        }
        if(input.direction === RIGHT) {
            nextX += gridSize;
            this.body.animations.play("walkRight");
        }

        this.facingDirection = input.direction ?? this.facingDirection;

        if(isSpaceFree(walls, nextX, nextY)){
            this.destinationPostion.x = nextX;
            this.destinationPostion.y = nextY;
        }
    }

    workOnItemPickup(delta) {
        this.itemPickUpTime = this.itemPickUpTime - delta;
        this.body.animations.play("pickUpDown")

        if(this.itemPickUpTime <= 0) {
            this.itemPickUpShell.destroy();
        }
    }

    onPickUpItem({image, position}) {
        this.destinationPostion = position.duplicate();
        this.itemPickUpTime = 500;

        this.itemPickUpShell = new GameObject({});
        this.itemPickUpShell.addChild(new Sprite({
            resource: image,
            position: new Vector2(0, -18)
        }));
        this.addChild(this.itemPickUpShell);

    }
}
