Game.Builder = function(width, height, depth) {
    this._width = width;
    this._height = height;
    this._depth = depth;
    this._tiles = new Array(depth);
    for (var z = 0; z < depth; z++) {
	this._tiles[z] = this._generateLevel(z);
    }
};

Game.Builder.prototype.getTiles = function() {
    return this._tiles;
};

Game.Builder.prototype.getWidth = function() {
    return this._width;
};

Game.Builder.prototype.getHeight = function() {
    return this._height;
};

Game.Builder.prototype.getDepth = function() {
    return this._depth;
};

Game.Builder.prototype._generateLevel = function(z) {
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
	    map[x][y] = Game.Tile.Floor;
	} else {
	    map[x][y] = Game.Tile.Wall;
	}
    });
    var rooms = generator.getRooms();
    for (var i = 0; i < rooms.length; i++) {
	var room = rooms[i];
	room.getDoors(function(x, y) {
	    map[x][y] = Game.Tile.ClosedDoor;
	});
    }
    if (z > 0) {
	var x = ROT.RNG.getUniformInt(rooms[0].getLeft() + 1, rooms[0].getRight() - 1);
	var y = ROT.RNG.getUniformInt(rooms[0].getTop() + 1, rooms[0].getBottom() - 1);
	map[x][y] = Game.Tile.StairsUp;
    }
    if (z < this._depth - 1) {
	var x = ROT.RNG.getUniformInt(rooms[rooms.length - 1].getLeft() + 1, rooms[rooms.length - 1].getRight() - 1);
	var y = ROT.RNG.getUniformInt(rooms[rooms.length - 1].getTop() + 1, rooms[rooms.length - 1].getBottom() - 1);
	map[x][y] = Game.Tile.StairsDown;
    }
    return map;
};
