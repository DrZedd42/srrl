Game.Screen.playScreen = {

    _player : null,

    enter : function() {
	this._player = new Game.Entity(Game.Entity.Player);
	var map = new Game.Map.Barrens();
	map.addEntityAtRandomPosition(this._player, 0);
	map.getEngine().start();
	this._map = map;
    },

    exit : function() {
    },

    render : function(display) {
	var screenWidth = Game.getScreenWidth();
	var screenHeight = Game.getScreenHeight();
	var offsets = this.getScreenOffsets();
	var topLeftX = offsets.x;
	var topLeftY = offsets.y;

	var map = this._player.getMap();
	var visibleCells = {};
	var currentDepth = this._player.getZ();

	map.getFov(currentDepth).compute(this._player.getX(), this._player.getY(), this._player.getSightRadius(),
		function(x, y, radius, visibility) {
		    visibleCells[x + "," + y] = true;
		    map.setExplored(x, y, currentDepth, true);
		});	
	
	for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
	    for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
		if (map.isExplored(x, y, currentDepth)) {
		    var glyph = map.getTile(x, y, currentDepth);
		    var foreground = glyph.getForeground();
		    var background = glyph.getBackground();
		    if (visibleCells[x + ',' + y]) {
			var items = map.getItemsAt(x, y, currentDepth);
			if (items) {
			    glyph = items[items.length - 1];
			}
        		if (map.getEntityAt(x, y, currentDepth)) {
        		    glyph = map.getEntityAt(x, y, currentDepth);
        		}
        		foreground = glyph.getForeground();
		    } else {
			background = "#222";
			foreground = "#444";
		    }
    		    display.draw(x, y, glyph.getCharacter(), foreground, background);
		}
	    }
	}
    },

    handleInput : function(inputType, inputData) {
	if (inputType === 'keydown') {
	    if (inputData.keyCode === ROT.VK_LEFT) {
		this.move(-1, 0, 0);
	    } else if (inputData.keyCode === ROT.VK_RIGHT) {
		this.move(1, 0, 0);
	    } else if (inputData.keyCode === ROT.VK_UP) {
		this.move(0, -1, 0);
	    } else if (inputData.keyCode === ROT.VK_DOWN) {
		this.move(0, 1, 0);
	    } else {
		return;
	    }
	    this._player.getMap().getEngine().unlock();
	} else if (inputType === 'keypress') {
	    var keyChar = String.fromCharCode(inputData.charCode);
	    if (keyChar === '>') {
		this.move(0, 0, 1);
	    } else if (keyChar === '<') {
		this.move(0, 0, -1);
	    } else {
		return;
	    }
	    this._player.getMap().getEngine().unlock();
	}
    },

    update( player) {
	this._player.setRace(player.getRace());
	this._player.setArchetype(player.getArchetype());
    },
    
    getScreenOffsets : function() {
	var dx = Math.max(0, this._player.getX() - (Game.getScreenWidth() / 2));
	dx = Math.min(dx, this._player.getMap().getWidth() - Game.getScreenWidth());
	var dy = Math.max(0, this._player.getY() - (Game.getScreenHeight() / 2));
	dy = Math.min(dy, this._player.getMap().getHeight() - Game.getScreenHeight());
	return {
	    x : dx,
	    y : dy
	};
    },
    
    move : function(dX, dY, dZ) {
	var newX = this._player.getX() + dX;
	var newY = this._player.getY() + dY;
	var newZ = this._player.getZ() + dZ;
	this._player.move(newX, newY, newZ, this._player.getMap());
    },

};
