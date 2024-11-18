class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    duplicate() {
        return new Vector2(this.x, this.y);
    }
} // end Vector class

var global = window || global;
global.Vector2 = Vector2;

gridCells = n => {
    return n * 16;
}

function moveTowards (person, destinationPostion, speed) {
    let distanceToTravelX = destinationPostion.x - person.position.x;
    let distanceToTravelY = destinationPostion.y - person.position.y;

    let distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);

    if(distance <= speed) {
        person.position.x = destinationPostion.x;
        person.position.y = destinationPostion.y;
    } else {
        let normalizedX = distanceToTravelX / distance;
        let normalizedY = distanceToTravelY / distance;

        person.position.x += normalizedX * speed;
        person.position.y += normalizedY * speed;

        distanceToTravelX = destinationPostion.x - person.position.x;
        distanceToTravelY = destinationPostion.y - person.position.y;

        distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);
    }

    return distance;
}

const walls = new Set();
walls.add(`64,48`);
walls.add(`64,64`);
walls.add(`64,80`);
walls.add(`80,64`);
walls.add(`80,80`);
walls.add(`112,80`);
walls.add(`128,80`);
walls.add(`144,80`);
walls.add(`160,80`);

const isSpaceFree = (walls, x, y) => {
    const str = `${x},${y}`;
    const isWallPresent = walls.has(str);

    return !isWallPresent;
}
