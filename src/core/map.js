Game.Map = function(tiles) {
    this._tiles = tiles;

    this._depth = tiles.length;
    this._width = tiles[0].length;
    this._height = tiles[0][0].length;

    this._fov = [];
    this.setupFov();

    this._entities = {};
    this._items = {};

    this._scheduler = new ROT.Scheduler.Speed();

    this._engine = new ROT.Engine(this._scheduler);

    this._explored = new Array(this._depth);
    this._setupExploredArray();

    this._player = null;
}

Game.Map.prototype._setupExploredArray = function() {
    for (var z = 0; z < this._depth; z++) {
	this._explored[z] = new Array(this._width);
	for (var x = 0; x < this._width; x++) {
	    this._explored[z][x] = new Array(this._height);
	    for (var y = 0; y < this._height; y++) {
		this._explored[z][x][y] = false;
	    }
	}
    }
};

Game.Map.prototype.setExplored = function(x, y, z, state) {
    if (this.getTile(x, y, z) !== Game.Tile.Null) {
	this._explored[z][x][y] = state;
    }
};

Game.Map.prototype.isExplored = function(x, y, z) {
    if (this.getTile(x, y, z) !== Game.Tile.Null) {
	return this._explored[z][x][y];
    } else {
	return false;
    }
};

Game.Map.prototype.getWidth = function() {
    return this._width;
};

Game.Map.prototype.getHeight = function() {
    return this._height;
};

Game.Map.prototype.getDepth = function() {
    return this._depth;
};

Game.Map.prototype.getEngine = function() {
    return this._engine;
};

Game.Map.prototype.getFov = function(z) {
    return this._fov[z];
};

Game.Map.prototype.setTile = function(tile, x, y, z) {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height || z < 0 || z > this._depth) {
	return;
    } else {
	this._tiles[z][x][y] = tile;
    }
};

Game.Map.prototype.getTile = function(x, y, z) {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height || z < 0 || z > this._depth) {
	return Game.Tile.Null;
    } else {
	return this._tiles[z][x][y] || Game.Tile.Null;
    }
};

Game.Map.prototype.findTilePosition = function(tile, z) {
    var x = 0;
    var y = 0;
    var z = z;
    for (var dx = 0; dx < this._width; dx++) {
	for (var dy = 0; dy < this._height; dy++) {
	    if (this._tiles[z][dx][dy] === tile) {
		x = dx;
		y = dy;
	    }
	}
    }
    return {
	x : x,
	y : y,
	z : z
    };
}

Game.Map.prototype.getRandomFloorPosition = function(z) {
    var x = 0;
    var y = 0;
    var z = z;
    do {
	x = Math.floor(Math.random() * this._width);
	y = Math.floor(Math.random() * this._height);
    } while (!this.isEmpty(x, y, z));
    return {
	x : x,
	y : y,
	z : z
    };
};

Game.Map.prototype.isEmpty = function(x, y, z) {
    return this.getTile(x, y, z) == Game.Tile.Floor && this.getEntityAt(x, y, z) == null;
};

Game.Map.prototype.getEntityAt = function(x, y, z) {
    return this._entities[x + ',' + y + ',' + z];
};

Game.Map.prototype.addEntityAtRandomPosition = function(entity, z) {
    var position = this.getRandomFloorPosition(z);
    entity.setX(position.x);
    entity.setY(position.y);
    entity.setZ(position.z);
    this.addEntity(entity);
};

Game.Map.prototype.addEntity = function(entity) {
    entity.setMap(this);
    this.updateEntityPosition(entity);
    if (entity.hasMixin('Actor')) {
	this._scheduler.add(entity, true);
    }
    if (entity.hasMixin(Game.EntityMixins.PlayerActor)) {
	this._player = entity;
    }
};

Game.Map.prototype.updateEntityPosition = function(entity, oldX, oldY, oldZ) {
    if (typeof oldX === 'number') {
	var oldKey = oldX + ',' + oldY + ',' + oldZ;
	if (this._entities[oldKey] == entity) {
	    delete this._entities[oldKey];
	}
    }
    if (entity.getX() < 0 || entity.getX() >= this._width || entity.getY() < 0 || entity.getY() >= this._height
	    || entity.getZ() < 0 || entity.getZ() >= this._depth) {
	throw new Error("Entity's position is out of bounds.");
    }
    var key = entity.getX() + ',' + entity.getY() + ',' + entity.getZ();
    if (this._entities[key]) {
	throw new Error('Tried to add an entity at an occupied position.');
    }
    this._entities[key] = entity;
};

Game.Map.prototype.removeEntity = function(entity) {
    var key = entity.getX() + ',' + entity.getY() + ',' + entity.getZ();
    if (this._entities[key] == entity) {
	delete this._entities[key];
    }
    if (entity.hasMixin('Actor')) {
	this._scheduler.remove(entity);
    }
    if (entity.hasMixin(Game.EntityMixins.PlayerActor)) {
	this._player = undefined;
    }
};

Game.Map.prototype.getItemsAt = function(x, y, z) {
    return this._items[x + ',' + y + ',' + z];
};

Game.Map.prototype.setItemsAt = function(x, y, z, items) {
    var key = x + ',' + y + ',' + z;
    if (items.length === 0) {
	if (this._items[key]) {
	    delete this._items[key];
	}
    } else {
	this._items[key] = items;
    }
};

Game.Map.prototype.addItem = function(x, y, z, item) {
    var key = x + ',' + y + ',' + z;
    if (this._items[key]) {
	this._items[key].push(item);
    } else {
	this._items[key] = [ item ];
    }
};

Game.Map.prototype.addItemAtRandomPosition = function(item, z) {
    var position = this.getRandomFloorPosition(z);
    this.addItem(position.x, position.y, position.z, item);
};

Game.Map.prototype.setupFov = function() {
    var map = this;
    for (var z = 0; z < this._depth; z++) {
	(function() {
	    var depth = z;
	    map._fov.push(new ROT.FOV.DiscreteShadowcasting(function(x, y) {
		return !map.getTile(x, y, depth).isBlockingLight();
	    }, {
		topology : 8
	    }));
	})();
    }
};

Game.Map.prototype.getPlayer = function() {
    return this._player;
};
