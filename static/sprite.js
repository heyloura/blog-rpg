class Sprite extends GameObject {
    constructor({
        resource, 
        frameSize, 
        xFrames, // sprite location along the x axis of the image
        yFrames, // sprite location along the y axis of the image
        frame, // which frame we want to show
        scale, // how large to draw the image
        position, // where do we want to draw it (top left corner)
        animations
    }) {
        super({});

        this.resource = resource; 
        this.frameSize = frameSize ?? new Vector2(16,16);
        this.xFrames = xFrames ?? 1;
        this.yFrames = yFrames ?? 1; 
        this.frame = frame ?? 0;
        this.frameMap = new Map(); 
        this.scale = scale ?? 1; 
        this.position = position ?? new Vector2(0,0); 
        this.buildFrameMap();
        this.animations = animations ?? null;
    }

    buildFrameMap() {
        let frameCount = 0;
        for(let y = 0; y < this.yFrames; y++) {
            for(let x = 0; x < this.xFrames; x++) {
                this.frameMap.set(frameCount,new Vector2(this.frameSize.x * x, this.frameSize.y * y));
                frameCount++;
            }                        
        }
    }

    step(delta) {
        if(!this.animations) {
            return;
        }
        this.animations.step(delta);
        this.frame = this.animations.frame;
    }

    drawImage(ctx, x, y) {
        if(!this.resource.isLoaded) {
            return;
        }

        let frameCoordX = 0;
        let frameCoordY = 0;
        const frame = this.frameMap.get(this.frame);

        if(frame) {
            frameCoordX = frame.x;
            frameCoordY = frame.y;
        }

        ctx.drawImage(
            this.resource.image,
            frameCoordX,
            frameCoordY,
            this.frameSize.x,
            this.frameSize.y,
            x,
            y,
            this.frameSize.x * this.scale,
            this.frameSize.y * this.scale
        );
    }
} // end class Sprite
