class GameLoop {
    constructor(update, render) {
        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        this.timeStep = 1000 / 60; // 60 frames per second
        this.update = update;
        this.render = render;
        this.animationFrameId = null;
        this.isRunning = false;
    }

    mainLoop = (timestamp) => {
        if(!this.isRunning) return;

        let deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        this.accumulatedTime += deltaTime;

        while(this.accumulatedTime >= this.timeStep) {
            //console.log(this.timeStep, this.accumulatedTime)
            this.update(this.timeStep);
            this.accumulatedTime -= this.timeStep;
        }

        this.render();

        this.animationFrameId = requestAnimationFrame(this.mainLoop);
    }

    start() {
        if(!this.isRunning) {
            this.isRunning = true;
            this.animationFrameId = requestAnimationFrame(this.mainLoop);
        }
    }

    stop() {
        if(this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.isRunning = false;
    }
  } // end class GameLoop 
