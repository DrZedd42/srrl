class Map {
    
    constructor(tiles) {
	this._tiles = tiles;
	this._depth = tiles.length;
	this._width = tiles[0].length;
	this._height = tiles[0][0].length;
	
	this._fov = [];
	this.setupFov();

	this._entities = {};
	this._items = {};
	this._effects = [];

	this._scheduler = new ROT.Scheduler.Speed();
	this._engine = new ROT.Engine(this._scheduler);

	this._explored = new Array(this._depth);
	this.setupExploredArray();
    }
    
    set width(width) {
	this._width = width;
    }
    
    get width() {
	return this._width;
    }

    set height(height) {
	this._height = height;
    }

    get height() {
	return this._height;
    }
    
    set depth(depth) {
	this._depth = depth;
    }
    
    get depth() {
	return this._depth;
    }
    
    set engine(engine) {
	this._engine = engine;
    }
    
    get engine() {
	return this._engine;
    }

    set scheduler(scheduler) {
	this._scheduler = scheduler;
    }
    
    get scheduler() {
	return this._scheduler;
    }
    
    set tiles(tiles) {
	this._tiles = tiles;
    }
    
    get tiles() {
	return this._tiles;
    }
    
    set explored(explored) {
	this._explored = explored;
    }
    
    get explored() {
	return this._explored;
    }

    set fov(fov) {
	this._fov = fov;
    }
    
    get fov() {
	return this._fov;
    }
    
    set entities(entities) {
	this._entities = entities;
    }
    
    get entities() {
	return this._entities;
    }
    
    set items(items) {
	this._items = items;
    }
    
    get items() {
	return this._items;
    }
    
    set player(player) {
	this._player = player;
    }
    
    get player() {
	return this._player;
    }
    
    setupExploredArray() {
	for (let z = 0; z < this.depth; z++) {
	    this._explored[z] = new Array(this.width);
	    for (let x = 0; x < this.width; x++) {
		this.explored[z][x] = new Array(this.height);
		for (var y = 0; y < this.height; y++) {
		    this.setExplored(x, y, z, false);
		}
	    }
	}
    }
    
    setupFov() {
	var map = this;
	for (let z = 0; z < this.depth; z++) {
	    (function() {
		let depth = z;
		map.fov.push(new ROT.FOV.DiscreteShadowcasting(function(x, y) {
		    return !map.getTile(x, y, depth).blocksLight;
		},
		{
		    topology : 8
		}));
	    })();
	}
    }

    
    setExplored(x, y, z, state) {
	if (this.getTile(x, y, z) !== Tile.Null) {
	    this.explored[z][x][y] = state;
	}
    }

    getExplored(x, y, z) {
	if (this.getTile(x, y, z) !== Tile.Null) {
	    return this.explored[z][x][y];
	} else {
	    return false;
	}
    }
    
    getFov(z) {
	return this.fov[z];
    }
    
    setTile(tile, x, y, z) {
	if (x < 0 || x >= this.width || y < 0 || y >= this.height || z < 0 || z > this.depth) {
	    return;
	} else {
	    this.tiles[z][x][y] = tile;
	}
    }
    
    getTile(x, y, z) {
	if (x < 0 || x >= this.width || y < 0 || y >= this.height || z < 0 || z > this.depth) {
	    return Tile.Null;
	} else {
	    return this.tiles[z][x][y] || Tile.Null;
	}
    }
    
    getRandomFloorPosition(z) {
	let x = 0;
	let y = 0;
	
	do {
	    x = Math.floor(Math.random() * this.width);
	    y = Math.floor(Math.random() * this.height);
	} while (!this.isEmpty(x, y, z));
	
	return {
	    x : x,
	    y : y,
	    z : z
	};
    }

    isEmpty(x, y, z) {
	return this.getTile(x, y, z).is(Tile.Floor) && this.getEntityAt(x, y, z) == null;
    }
    
    findTilePosition(tile, z) {
	let x = 0;
	let y = 0;
	for (let dx = 0; dx < this.width; dx++) {
	    for (let dy = 0; dy < this.height; dy++) {
		if (this.tiles[z][dx][dy].is(tile)) {
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
    
    updateEntityPosition(entity, oldX, oldY, oldZ) {
	if (typeof oldX === 'number') {
	    let oldKey = oldX + ',' + oldY + ',' + oldZ;
	    if (this.entities[oldKey] == entity) {
		delete this.entities[oldKey];
	    }
	}
	if (entity.x < 0 || entity.x >= this.width || entity.y < 0 || entity.y >= this.height
		    || entity.z < 0 || entity.z >= this.depth) {
	    throw new Error("Entity's position is out of bounds.");
	}
	let key = entity.x + ',' + entity.y + ',' + entity.z;
	if (this.entities[key]) {
	    throw new Error('Tried to add an entity at an occupied position.');
	}
	this.entities[key] = entity;
    }

    getEntityAt(x, y, z) {
	return this.entities[x + ',' + y + ',' + z];
    }
    
    addEntity(entity) {
	entity.map = this;
	this.updateEntityPosition(entity);
	if (entity.hasMixin('Actor')) {
	    this.scheduler.add(entity, true);
	}
	if (entity.hasMixin('PlayerActor')) {
	    this.player = entity;
	}
    }
    
    addEntityAtRandomPosition(entity, z) {
	var position = this.getRandomFloorPosition(z);
	entity.x = position.x;
	entity.y = position.y;
	entity.z = position.z;
	this.addEntity(entity);
    }
    
    
    removeEntity(entity) {
	let key = entity.x + ',' + entity.y + ',' + entity.z;
	if (this.entities[key] == entity) {
	    delete this.entities[key];
	}
	if (entity.hasMixin('Actor')) {
	    this.scheduler.remove(entity);
	}
	if (entity.hasMixin('PlayerActor')) {
	    this.player = undefined;
	}
    }

    getItemsAt(x, y, z) {
	return this.items[x + ',' + y + ',' + z];
    }
    
    setItemsAt(x, y, z, items) {
	let key = x + ',' + y + ',' + z;
	if (items.length === 0) {
	   if (this.items[key]) {
	       delete this.items[key];
	   }
	} else {
	   this.items[key] = items;
	}
    }

    addItem(x, y, z, item) {
	let key = x + ',' + y + ',' + z;
	if (this.items[key]) {
	   this.items[key].push(item);
	} else {
	   this.items[key] = [ item ];
	}
    }
   
    removeItem(x, y, z, item) {
	let key = x + ',' + y + ',' + z;
	if (this.items[key]) {
	    this.items[key].pop(item);
	    if (this.items[key].length === 0) {
		delete this.items[key];
	    }
	}
    }
    
    addItemAtRandomPosition(item, z) {
	let position = this.getRandomFloorPosition(z);
	this.addItem(position.x, position.y, position.z, item);
    }
    
}

