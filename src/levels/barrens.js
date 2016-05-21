Game.Map.Barrens = function() {

    var _data = [ 
                 "###########################", 
                 "#.........#....#....#.....#", 
                 "#.........#....#....#.....#", 
                 "#.........+....###+###+####",
                 "#.........#...............#", 
                 "#.#..#..#.#...............#", 
                 "#.........#...####+###+####", 
                 "#.........#...#.....#.....#",
                 "#.........#...#.....#.....#", 
                 "#.........#...#.....#.....#", 
                 "###########################" ];
    
    Game.Map.call(this, this._generateTiles(_data));

    this.addEntityAtRandomPosition(new Game.Entity(Game.Entity.Johnson), 0);
}

Game.Map.Barrens.extend(Game.Map);

Game.Map.Barrens.prototype._generateTiles = function(data) {
    var width = data[0].length;
    var height = data.length

    var tiles = new Array(width);
    for (var x = 0; x < width; x++) {
	tiles[x] = new Array(height);
	for (var y = 0; y < height; y++) {
	    var char = data[y][x];
	    if (char == '#') {
		tiles[x][y] = Game.Tile.Wall;
	    } else if (char == '.') {
		tiles[x][y] = Game.Tile.Floor;
	    } else if (char == '+') {
		tiles[x][y] = Game.Tile.ClosedDoor;
	    }

	}
    }

    return [ tiles ];
}
