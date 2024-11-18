class Animations {
    constructor(patterns) {
        this.patterns = patterns;
        this.activeKey = Object.keys(this.patterns)[0];
    }

    step(delta) {
        this.patterns[this.activeKey].step(delta);
    }

    get frame() {
        return this.patterns[this.activeKey].frame;
    }

    play(key, startAtTime = 0) {
        if(this.activeKey === key) {
            return;
        }

        this.activeKey = key;
        this.patterns[this.activeKey].currentTime = startAtTime;
    }
  }

class FrameIndexPattern {
    constructor(animationConfig) {
        this.animationConfig = animationConfig;
        this.duration = animationConfig.duration ?? 500;
        this.currentTime = 0;
    }

    get frame() {
        const {frames} = this.animationConfig;
        for(let i = frames.length - 1; i >=0; i--) {
            if(this.currentTime >= frames[i].time) {
                return frames[i].frame;
            }
        }
        throw "Time is before the first keyframe"
    }

    step(delta) {
        this.currentTime += delta;
        if(this.currentTime >= this.duration) {
            this.currentTime = 0;
        }
    }
}
