class Builder {
    
    constructor(width, height, depth) {
	this._width = width;
	this._height = height;
	this._depth = depth;
	
	this._tiles = new Array(depth);

	for (var z = 0; z < depth; z++) {
	    this._tiles[z] = this.generateLevel(z);
	}
    }
    
    get width() {
	return this._width;
    }
    
    get height() {
	return this._height;
    }
    
    get depth() {
	return this._depth;
    }
    
    get tiles() {
	return this._tiles;
    }
    
    generateLevel(z) {
	//ROT.RNG.setSeed(1234);
	var map = new Array(this._width);

	for (var w = 0; w < this._width; w++) {
	    map[w] = new Array(this._height);
	}

	var generator = new ROT.Map.Digger(this._width, this._height, {
	    roomWidth : [ 4, 12 ],
	    roomHeight : [ 4, 9 ],
	    dugPercentage : 0.3,
	    corridorLength : [ 3, 10 ],
	    timeLimit : 1000
	});

	generator.create(function(x, y, v) {
	    if (v === 0) {
		map[x][y] = Tile.Floor;
	    } else {
		map[x][y] = Tile.Wall;
	    }
	});

	var rooms = generator.getRooms();
	
	for (var i = 0; i < rooms.length; i++) {
	    var room = rooms[i];
	    room.getDoors(function(x, y) {
		map[x][y] = Tile.ClosedDoor;
	    });
	}

	if (z > 0) {
	    var x = ROT.RNG.getUniformInt(rooms[0].getLeft() + 1, rooms[0].getRight() - 1);
	    var y = ROT.RNG.getUniformInt(rooms[0].getTop() + 1, rooms[0].getBottom() - 1);
	    map[x][y] = Tile.StairsUp;
	}
	    
	if (z < this._depth - 1) {
	    var x = ROT.RNG.getUniformInt(rooms[rooms.length - 1].getLeft() + 1, rooms[rooms.length - 1].getRight() - 1);
	    var y = ROT.RNG.getUniformInt(rooms[rooms.length - 1].getTop() + 1, rooms[rooms.length - 1].getBottom() - 1);
	    map[x][y] = Tile.StairsDown;
	}

	return map;
    }
    
}
