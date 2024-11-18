class Node {
    constructor(value) {
        this.value = value ?? {};
        this.adjacents = [];
    }

    addAdjacent(node) {
        if(this.adjacents.indexOf(node) == -1) {
            this.adjacents.push(node);
        }   
    }

    removeAdjacent(node) {
        this.adjacents = this.adjacents.filter(adj => adj != node);
    }

    isAdjacent(node) {
        return this.adjacents.indexOf(node) > -1;
    }
}

const GRAPH_DIRECTED = "Directed";
const GRAPH_UNDIRECTED = "Undirected";
class Graph {
    constructor(edgeDirection = GRAPH_UNDIRECTED) {
        this.nodes = new Map();
        this.edgeDirection = edgeDirection;
    }

    addEdge(source, destination) {
        const sourceNode = this.addVertex(source);
        const destinationNode = this.addVertex(destination);

        sourceNode.addAdjacent(destinationNode);

        if(this.edgeDirection === GRAPH_UNDIRECTED) {
            destinationNode.addAdjacent(sourceNode)
        }

        return [sourceNode, destinationNode];
    }

    addVertex(value) {
        if(this.nodes.has(value)) {
            return this.nodes.get(value);
        }

        const vertex = new Node(value);
        this.nodes.set(value, vertex);
        return vertex;
    }

    removeVertex(value) {
        const current = this.nodes.get(value);
        if(current) {
            this.nodes.forEach(node => node.removeAdjacent(current));
        }
        return this.nodes.delete(value);
    }

    removeEdge(source, destination) {
        const sourceNode = this.nodes.get(source);
        const destinationNode = this.nodes.get(destination);

        if(sourceNode && destinationNode) {
            sourceNode.removeAdjacent(destinationNode);

            if(this.edgeDirection === GRAPH_UNDIRECTED) {
                destinationNode.removeAdjacent(sourceNode);
            }
        }

        return [sourceNode, destinationNode];
    }

    getVerticies() {
        return this.nodes;
    }
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomKey(collection) {
    let keys = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
}

function assignVertexToGrid(node, numberOfNodes, visitedCount = 1) {
    console.log(node.value.type, node.value.position, numberOfNodes, visitedCount)
    if(visitedCount == numberOfNodes) {
        return;
    }
    node.adjacents.forEach((adj, index) => {
        if(!adj.value.visited) {    
            var parentPostion = node.value.position
            adj.value.visited = true;    
            if(index == 0) {
                adj.value.position = new Vector2(parentPostion.x + 1, parentPostion.y);
            }
            if(index == 1) {
                adj.value.position = new Vector2(parentPostion.x + 1, parentPostion.y + 1);
            }
            if(index == 2) {
                adj.value.position = new Vector2(parentPostion.x + 1, parentPostion.y - 1);
            }
            assignVertexToGrid(adj, numberOfNodes, visitedCount + 1) 
        }
    });
}

class GameMap extends GameObject {
    constructor() {
        super({});

        // I want each dungeon to have an entrance
        // two encounters
        // boss encounter
        // discover Loura

        const graph = new Graph();

        const rooms = [];
        rooms.push({type: "entrance", visited: false});
        rooms.push({type: "encounter1", visited: false});
        rooms.push({type: "encounter2", visited: false});
        rooms.push({type: "boss", visited: false});
        rooms.push({type: "me", visited: false});

        //first walk
        const roomNodes = [];
        for(var i = 0; i < rooms.length; i++) {
            var connects = randomIntFromInterval(0, rooms.length - 1);
            if(connects == i) {
                // this is a self connection
                while(connects == i) {
                    connects = randomIntFromInterval(0, rooms.length - 1);
                }
            }
            console.log(rooms[i].type + ' connects to  ' + rooms[connects].type)
            graph.addEdge(rooms[i], rooms[connects]);
        }

        console.log('---------------------------------')

        // starting node for snap to grid
        let visited = [];
        const nodes = graph.getVerticies();
        const startingNode = nodes.get(getRandomKey(nodes));
        startingNode.value.position = new Vector2(0, 0);
        startingNode.value.visited = true;
        
        assignVertexToGrid(startingNode, nodes.size);
        let height = 0;
        let width = 0;
        let minHeight = 0 

        nodes.forEach(node => {
            if(node.value.position && node.value.position.x > width)
            {
                width = node.value.position.x;
            }
            if(node.value.position && node.value.position.y > height)
            {
                height = node.value.position.y;
            }
            if(node.value.position && node.value.position.y < minHeight)
            {
                minHeight = node.value.position.y;
            }
        });

        height = height + Math.abs(minHeight);

        // console.log(width, height)
        
        // var mapArray = [
        //     [5, 5, 5, 5 ,5],
        //     [5, 4, 4, 4 ,5],
        //     [5, 4, 4, 4 ,5],
        //     [5, 4, 4, 4 ,5],
        //     [5, 5, 5, 5 ,5],
        // ];

        let summer = 0;
        let fall = 14 * 18;
        let winter = 42 * 18;
        let spring = 28 * 18;
        let season = fall;
        var mapArray = [];

        for (var y = 0; y < (height + 1) * 5; y++) {
            var row = [];
            for (var x = 0; x < (width + 1) * 5; x++) {
                row.push(-1);
            }
            mapArray.push(row);
        }

        for (var y = 0; y < height + 1; y++) {
            var potentialMatch = [];
            nodes.forEach(node => {
                if(node.value.position.y === y) {
                    potentialMatch.push(node);
                }
            });

            for (var x = 0; x < width + 1; x++) {
                var match = null;
                potentialMatch.forEach(node => {
                    if(node.value.position.x + minHeight === x) {
                        match = node;
                    }
                });
                if(match) {
                    // draw room
                    console.log(match);
                    for(var my = 0; my < 5; my++) {
                        for(var mx = 0; mx < 5; mx++) {
                            mapArray[my + ((y + minHeight) * 5)][mx + (x * 5)] = (match.value.type == 'me' ? 20 : match.value.type == 'boss' ? 21 : match.value.type == 'entrance' ? 22 : 5) + season;
                        }
                    }
                } else {

                }

            }
        }

        console.log(mapArray);

        for (var y = 0; y < mapArray.length; y++) {
            for (var x = 0; x < mapArray[y].length; x++) {
                if(mapArray[y][x] > -1) {
                    const sprite = new Sprite({
                        resource: global.Resources.images.tiles,
                        xFrames: 18,
                        yFrames: 14*4,
                        frame: mapArray[y][x],
                        position: new Vector2(x * 16, y * 16),
                        frameSize: new Vector2(16, 16)
                    })
    
                    this.addChild(sprite);
                }
            }
        }
    }

    ready() {

    }
}
