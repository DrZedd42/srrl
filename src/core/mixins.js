const PlayerActor = (superclass) => class extends superclass {
    
    constructor(properties) {
	super(properties);
	this.mixinIds.push('Actor');
	this.mixinIds.push('PlayerActor');
    }
    
    act() {
	game.refresh();
	this.map.engine.lock();
	this.clearMessages();
    }
    
}

const TaskActor = (superclass) => class extends superclass {

    constructor(properties) {
	super(properties);
	this.mixinIds.push('Actor');
	this.mixinIds.push('TaskActor');
	this._tasks = properties['tasks'] || [ 'wander' ];
    }
    
    get tasks() {
	return this._tasks;
    }
    
    act() {
	for (var i = 0; i < this._tasks.length; i++) {
	    if (this.canDoTask(this.tasks[i]) && this[this.tasks[i]]) {
		this[this.tasks[i]]();
		return;
	    }
	}
    }
    
    canDoTask(task) {
	if (task === 'hunt') {
	    return this.hasMixin('Sight') && this.canSee(this.map.player);
	} else if (task === 'wander') {
	    return true;
	}
    }
    
    hunt() {
	let player = this.map.player;
	let offsets = Math.abs(player.x - this.x) + Math.abs(player.y - this.y);
	if (offsets === 1) {
	    if (this.hasMixin('Attacker')) {
		this.attack(player);
		return;
	    }
	}
	let source = this;
	let z = source.z;
	let path = new ROT.Path.AStar(player.x, player.y, function(x, y) {
	    let entity = source.map.getEntityAt(x, y, z);
	    if (entity && entity !== player && entity !== source) {
		return false;
	    }
	    return source.map.getTile(x, y, z).walkable;
	}, {
	    topology : 4
	});
	let count = 0;
	path.compute(source.x, source.y, function(x, y) {
	    if (count == 1) {
		source.move(x, y, z);
	    }
	    count++;
	});	
    }
    
    wander() {
	var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
	if (Math.round(Math.random()) === 1) {
	    this.move(this.x + moveOffset, this.y, this.z);
	} else {
	    this.move(this.x, this.y + moveOffset, this.z);
	}
    }
    
}

const Attacker = (superclass) => class extends superclass {

    constructor(properties) {
	super(properties);
	this.mixinIds.push('Attacker');
	this._attackValue = properties['attackValue'] || 1;
    }
    
    get attackValue() {
	return this._attackValue;
    }
    
    attack(target) {
	if (target.hasMixin('Defender')) {
	    let attack = this.attackValue;
	    let defense = target.defenseValue;
	    let max = Math.max(0, attack - defense);
	    let damage = 1 + Math.floor(Math.random() * max);
	    
	    this.sendMessage('You strike the %s for %d damage!', [ target.name, damage ]);
	    target.sendMessage('The %s strikes you for %d damage!', [ this.name, damage ]);
	    
	    target.takeDamage(this, damage);
	}
    }
    
}

const Defender = (superclass) => class extends superclass {
    
    constructor(properties) {
	super(properties);
	this.mixinIds.push('Defender');
	this._maxHp = properties['maxHp'] || 10;
	this._hp = properties['hp'] || this._maxHp;
	this._defenseValue = properties['defenseValue'] || 0;
    }
    
    set hp(hp) {
	this._hp = hp;
    }
    
    get hp() {
	return this._hp;
    }

    set maxHp(maxHp) {
	this._maxHp = maxHp;
    }

    get maxHp() {
	return this._maxHp;
    }
    
    set defenseValue(defenseValue) {
	this._defenseValue = defenseValue;
    }
    
    get defenseValue() {
	return this._defenseValue;
    }
    
    get defenseValue() {
	let modifier = 0;
	return this._defenseValue + modifier;
    }
    
    takeDamage(attacker, damage) {
	this.hp -= damage;
	if (this.hp <= 0) {
	    attacker.sendMessage('You kill the %s!', [ this.name ]);
	    this.kill();
	}
    }

}

const Sight = (superclass) => class extends superclass {
    
    constructor(properties) {
	super(properties);
	this.mixinIds.push('Sight');
	this._sightRadius = properties['sightRadius'] || 5;
    }
    
    get sightRadius() {
	return this._sightRadius;
    }

    canSee(entity) {
	if (!entity || this.map !== entity.map || this.z !== entity.z) {
	    return false;
	}
	let otherX = entity.x;
	let otherY = entity.y;
	if ((otherX - this.x) * (otherX - this.x) + (otherY - this.y) * (otherY - this.y) > this.sightRadius
		* this.sightRadius) {
	    return false;
	}
	let found = false;
	this.map.getFov(this.z).compute(this.x, this.y, this.sightRadius,
		function(x, y, radius, visibility) {
		    if (x === otherX && y === otherY) {
			found = true;
		    }
		});
	return found;
    }
    
}

const MessageRecipient = (superclass) => class extends superclass {
    
    constructor(properties) {
	super(properties);
	this.mixinIds.push('MessageRecipient');
	this._messages = [];
    }
    
    get messages() {
	return this._messages;
    }

    set messages(messages) {
	this._messages = messages;
    }
    
    receiveMessage(message) {
	this.messages.push(message);
    }
    
    clearMessages() {
	this.messages = [];
    }
    
}

const InventoryHolder = (superclass) => class extends superclass {

    constructor(properties) {
	super(properties);
	this.mixinIds.push('InventoryHolder');
	let inventorySlots = properties['inventorySize'] || 10;
	this._items = new Array(inventorySlots);
    }

    get items() {
	return this._items;
    }
    
    getItem(index) {
	return this.items[index];
    }
    
    addItem(item) {
	for (let i = 0; i < this.items.length; i++) {
	    if (!this.items[i] && item) {
		this.items[i] = item;
		return true;
	    }
	}
	return false;
    }

    removeItem(index) {
	if (this.items[index] && this.hasMixin('Equipper')) {
	    this.unequip(this.items[index]);
	}
	this.items[i] = null;
    }
    
    canAddItem() {
	for (let i = 0; i < this.items.length; i++) {
	    if (!this.items[i]) {
		return true;
	    }
	}
	return false;
    }
    
    pickupItems(items, x, y, z) {
	for (let i = 0; i < items.length; i++) {
	    if (this.addItem(items[i])) {
		this.map.removeItem(x, y, z, items[i]);
	    } else {
		return false;
	    }
	}
	return true;
    }

    dropItem(index) {
	if (this.items[index]) {
	    if (this.map) {
		this.map.addItem(this.x, this.y, this.z, this.items[index]);
	    }
	    this.removeItem(index);
	}
    }
    
}
