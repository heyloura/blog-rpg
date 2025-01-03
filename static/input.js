const LEFT = "LEFT";
const RIGHT = "RIGHT";
const UP = "UP";
const DOWN = "DOWN";

class Input {
    constructor() {
        this.heldDirections = [];
        document.addEventListener("keydown",(e) => {
            // need to not use if in inputs or textareas
            // also eventually on screen buttons for mobile...
            if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
            if(e.code === "ArrowUp" || e.code === "KeyW") 
            {
                this.onArrowPressed(UP);
            }
            if(e.code === "ArrowDown" || e.code === "KeyS") 
            {
                this.onArrowPressed(DOWN);
            }
            if(e.code === "ArrowLeft" || e.code === "KeyA") 
            {
                this.onArrowPressed(LEFT);
            }
            if(e.code === "ArrowRight" || e.code === "KeyD") 
            {
                this.onArrowPressed(RIGHT);
            }
        });
        document.addEventListener("keyup",(e) => {
            // need to not use if in inputs or textareas
            // also eventually on screen buttons for mobile...
            if(e.code === "ArrowUp" || e.code === "KeyW") 
            {
                this.onArrowReleased(UP);
            }
            if(e.code === "ArrowDown" || e.code === "KeyS") 
            {
                this.onArrowReleased(DOWN);
            }
            if(e.code === "ArrowLeft" || e.code === "KeyA") 
            {
                this.onArrowReleased(LEFT);
            }
            if(e.code === "ArrowRight" || e.code === "KeyD") 
            {
                this.onArrowReleased(RIGHT);
            }
        });
    }

    get direction() {
        return this.heldDirections[0];
    }

    onArrowPressed(direction) {
        if(this.heldDirections.indexOf(direction) === -1) {
            this.heldDirections.unshift(direction);
        }
    }

    onArrowReleased(direction) {
        const index = this.heldDirections.indexOf(direction);
        if(index === -1) {
            return;
        }

        this.heldDirections.splice(index, 1)
    }
}
