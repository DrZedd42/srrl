Game.Entity = function(properties) {
    properties = properties || {};

    Game.DynamicGlyph.call(this, properties);

    this._race = null;
    this._archetype = null;

    this._x = 0;
    this._y = 0;
    this._z = 0;

    this._alive = true;
    this._map = null;
    this._speed = properties['speed'] || 1000;
};

Game.Entity.extend(Game.DynamicGlyph);

Game.EntityRepository = new Game.Repository('entities', Game.Entity);

Game.Entity.prototype.setX = function(x) {
    this._x = x;
};

Game.Entity.prototype.setY = function(y) {
    this._y = y;
};

Game.Entity.prototype.setZ = function(z) {
    this._z = z;
};

Game.Entity.prototype.setSpeed = function(speed) {
    this._speed = speed;
};

Game.Entity.prototype.setMap = function(map) {
    this._map = map;
};

Game.Entity.prototype.setRace = function(race) {
    this._race = race;
};

Game.Entity.prototype.setArchetype = function(archetype) {
    this._archetype = archetype;
};

Game.Entity.prototype.setPosition = function(x, y, z) {
    var oldX = this._x;
    var oldY = this._y;
    var oldZ = this._z;
    this._x = x;
    this._y = y;
    this._z = z;
    if (this._map) {
	this._map.updateEntityPosition(this, oldX, oldY, oldZ);
    }
};

Game.Entity.prototype.getX = function() {
    return this._x;
};

Game.Entity.prototype.getY = function() {
    return this._y;
};

Game.Entity.prototype.getZ = function() {
    return this._z;
};

Game.Entity.prototype.getSpeed = function() {
    return this._speed;
};

Game.Entity.prototype.getMap = function() {
    return this._map;
};

Game.Entity.prototype.getRace = function() {
    return this._race;
};

Game.Entity.prototype.getArchetype = function() {
    return this._archetype;
};

Game.Entity.prototype.isAlive = function() {
    return this._alive;
};

Game.Entity.prototype.kill = function(message) {
    if (!this._alive) {
	return;
    }
    this._alive = false;
    if (message) {
	Game.sendMessage(this, message);
    } else {
	Game.sendMessage(this, "You have died!");
    }
    if (this.hasMixin(Game.EntityMixins.Player)) {
	this.act();
    } else {
	this.getMap().removeEntity(this);
    }
};

Game.Entity.prototype.switchMap = function(newMap) {
    if (newMap === this.getMap()) {
	return;
    }
    this.getMap().removeEntity(this);
    this._x = 0;
    this._y = 0;
    this._z = 0;
    newMap.addEntity(this);
};

Game.Entity.prototype.move = function(x, y, z, map) {
    var map = this.getMap();
    var tile = map.getTile(x, y, this.getZ());
    var target = map.getEntityAt(x, y, this.getZ());
    if (z < this.getZ()) {
	if (tile !== Game.Tile.StairsUp) {
	   // Game.sendMessage(this, "You can't go up here!");
	} else {
	    var position = this._map.findTilePosition(Game.Tile.StairsDown, z);
	    this.setPosition(position.x, position.y, z);
	   // Game.sendMessage(this, "You ascend to level %d!", [ z + 1 ]);
	}
    } else if (z > this.getZ()) {
	if (tile !== Game.Tile.StairsDown) {
	    //Game.sendMessage(this, "You can't go down here!");
	} else {
	    var position = this._map.findTilePosition(Game.Tile.StairsUp, z);
	    this.setPosition(position.x, position.y, z);
	   // Game.sendMessage(this, "You descend to level %d!", [ z + 1 ]);
	}
    } else if (target) {
	if (target.hasMixin('NPC')) {
	    target.interact(this);
	} else if (this.hasMixin('Attacker')) {
	}
	return false;
    } else if (tile === Game.Tile.ClosedDoor) {
	if (this.hasMixin(Game.EntityMixins.Player)) {
	    map.setTile(Game.Tile.OpenDoor, x, y, z);
	}
    } else if (tile.isWalkable()) {
	this.setPosition(x, y, z);
	var items = this.getMap().getItemsAt(x, y, z);
	if (items) {
	    if (items.length === 1) {
		Game.sendMessage(this, "You see %s.", [ items[0].describeA() ]);
	    } else {
		Game.sendMessage(this, "There are several objects here.");
	    }
	}
	return true;
    }

};
