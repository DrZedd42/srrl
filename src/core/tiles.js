class Tile extends Glyph {
    
    constructor(properties) {
	super(properties);
	properties = properties || {};
	this._id = properties['id'] || '';
	this._walkable = properties['walkable'] || false;
	this._blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true;
	this._description = properties['description'] || '';
    }
    
    get walkable() {
	return this._walkable;
    }
    
    get blocksLight() {
	return this._blocksLight;
    }
    
    get description() {
	return this._description;
    }
    
    get id() {
	return this._id;
    }
    
    is( obj ) {
	return Object.is(this.id, obj.id);
    }
    
    static get Wall() {
	return new Tile({
	    id : 'Wall',
	    character : '#',
	    foreground : '#888',
	    background : '#2e2e2e',
	    diggable : false,
	    description : 'A dungeon wall'
	});
    }
    
    static get Floor() {
	return new Tile({
	    id : 'Floor',
	    character : '.',
	    foreground : '#444',
	    background : '#222',
	    walkable : true,
	    blocksLight : false,
	    description : 'A dungeon floor'	    
	});
    }

    static get ClosedDoor() {
	return new Tile({
	    id : 'ClosedDoor',
	    character : '+',
	    foreground : 'yellow',
	    background : '#222',
	    walkable : true,
	    blocksLight : true,
	    diggable : false,
	    description : 'A closed door'	    
	});
    }

    static get OpenDoor() {
	return new Tile({
	    id : 'OpenDoor',
	    character : '-',
	    foreground : 'yellow',
	    background : '#222',
	    walkable : true,
	    blocksLight : false,
	    diggable : false,
	    description : 'An open door'    
	});
    }
    
    static get StairsUp() {
	return new Tile({
	    id : 'StairsUp',
	    character: '<',
	    foreground: 'white',
	    background : '#222',    
	    walkable: true,
	    blocksLight: false,
	    description: 'A staircase leading upwards'   
	});
    }

    static get StairsDown() {
	return new Tile({
	    id : 'StairsDown',
	    character: '>',
	    foreground: 'white',
	    background : '#222',    
	    walkable: true,
	    blocksLight: false,
	    description: 'A staircase leading downwards'
	});
    }
    
    static get Null() {
	return new Tile();
    }

}


