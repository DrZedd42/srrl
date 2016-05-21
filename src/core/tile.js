Game.Tile = function(properties) {
    properties = properties || {};
    Game.Glyph.call(this, properties);
    this._walkable = properties['walkable'] || false;
    this._diggable = properties['diggable'] || false;
    this._blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true;
    this._description = properties['description'] || '';
};

Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.isWalkable = function() {
    return this._walkable;
};

Game.Tile.prototype.isDiggable = function() {
    return this._diggable;
};

Game.Tile.prototype.isBlockingLight = function() {
    return this._blocksLight;
};

Game.Tile.prototype.getDescription = function() {
    return this._description;
};

Game.Tile.Null = new Game.Tile();

Game.Tile.Floor = new Game.Tile({
    character : '.',
    foreground : '#444',
    background : '#222',
    walkable : true,
    blocksLight : false,
    description : 'A dungeon floor'
});

Game.Tile.Wall = new Game.Tile({
    character : '#',
    foreground : '#888',
    background : '#2e2e2e',
    diggable : false,
    description : 'A dungeon wall'
});

Game.Tile.ClosedDoor = new Game.Tile({
    character : '+',
    foreground : 'yellow',
    background : '#222',
    walkable : true,
    blocksLight : true,
    diggable : false,
    description : 'A closed door'
});

Game.Tile.OpenDoor = new Game.Tile({
    character : '-',
    foreground : 'yellow',
    background : '#222',
    walkable : true,
    blocksLight : false,
    diggable : false,
    description : 'An open door'
});

Game.Tile.StairsUp = new Game.Tile({
    character : '<',
    foreground : 'white',
    background : '#222',
    walkable : true,
    blocksLight : false,
    description : 'A staircase leading upwards'
});

Game.Tile.StairsDown = new Game.Tile({
    character : '>',
    foreground : 'white',
    background : '#222',
    walkable : true,
    blocksLight : false,
    description : 'A staircase leading downwards'
});
