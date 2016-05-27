class Entity extends DynamicGlyph {
    
    constructor(properties) {
	super(properties);
	
	properties = properties || {};
	
	this._x = 0;
	this._y = 0;
	this._z = 0;

	this._alive = true;
	this._map = null;

	this._speed = properties['speed'] || 1000;
    }
    
    get x() {
	return this._x;
    }
    
    set x(x) {
	this._x = x;
    }
    
    get y() {
	return this._y;
    }
    
    set y(y) {
	this._y = y;
    }

    get z() {
	return this._z;
    }
    
    set z(z) {
	this._z = z;
    }
    
    get speed() {
	return this._speed;
    }
    
    set speed(speed) {
	this._speed = speed;
    }

    get alive() {
	return this._alive;
    }
    
    set alive(alive) {
	this._alive = alive;
    }
    
    get map() {
	return this._map;
    }
    
    set map(map) {
	this._map = map;
    }
    
    getSpeed() {
	return this.speed;
    }
    
    sendMessage(message, args) {
        if (this.hasMixin('MessageRecipient')) {
            if (args) {
        	message = vsprintf(message, args);
            }
            this.receiveMessage(message);
        }
    }
    
    setPosition(x, y, z) {
	let oldX = this.x;
	let oldY = this.y;
	let oldZ = this.z;
	this.x = x;
	this.y = y;
	this.z = z;
	if (this.map) {
	    this.map.updateEntityPosition(this, oldX, oldY, oldZ);
	}
    }
    
    kill(message) {
	if (!this.alive) {
	    return;
	}
	this.alive = false;
	if (this.hasMixin('PlayerActor')) {
	    this.act();
	} else {
	    this.map.removeEntity(this);
	}
    }
    
    move(x, y, z, map) {
	let tile = this.map.getTile(x, y, this.z);
	let target = this.map.getEntityAt(x, y, this.z);
	
	if (target) {
	    if (this.hasMixin('Attacker')
		&& (this.hasMixin('PlayerActor') || target.hasMixin('PlayerActor'))) {
		this.attack(target);
		return true;
	    }
	    return false;
	} else if (tile.is(Tile.ClosedDoor)) {
	    if (this.hasMixin('PlayerActor')) {
		map.setTile(Tile.OpenDoor, x, y, z);
	    }
	} else if (tile.walkable) {
	    if(tile.is(Tile.StairsUp) && this.hasMixin('PlayerActor')) {
		z = z - 1;
		let position = this.map.findTilePosition(Tile.StairsDown, z);
		x = position.x;
		y = position.y;
		this.sendMessage("You ascend to level %d!", [z + 1]);
	    } else if(tile.is(Tile.StairsDown) && this.hasMixin('PlayerActor')) {
		z = z + 1;
		let position = this.map.findTilePosition(Tile.StairsUp, z);
		x = position.x;
		y = position.y;
		this.sendMessage("You descend to level %d!", [z + 1]);
	    }
	    let items = this.map.getItemsAt(x, y, z);
	    if (items) {
		if (items.length === 1) {
		    this.sendMessage("You see %s.", [ items[0].describeA() ]);
		} else {
		    this.sendMessage("There are several objects here.");
		}
		if(this.hasMixin('InventoryHolder')) {
		    this.pickupItems(items, x, y, z);
		}
	    }
	    this.setPosition(x, y, z);
	    return true;
	}
	return false;
    }
    
}
