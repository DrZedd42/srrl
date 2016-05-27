class CreateScreen extends Screen {
    
    render(game, display) {
	super.render(game, display);
	display.drawText(1, 1, "%c{yellow}Shadowrun Roguelike");
    }
    
    handleInput(inputType, inputData, game) {
	if (inputType === 'keydown') {
	    if (inputData.keyCode === ROT.VK_RETURN) {
		game.switchScreen(new PlayScreen(new Player()));
	    }
	}
    }

}

class PlayScreen extends Screen {
    
    constructor(player) {
	super();
	this._player = player;
	this._subscreen = null;
	
	let tiles = new Builder(80, 24, 3).tiles;
	let map = new Map(tiles);
	map.addEntityAtRandomPosition(this.player, 0);
	
	for (let z = 0; z < map.depth; z++) {
	    for (let i = 0; i < 10; i++) {
		let entity = entityRepository.createRandom();
		map.addEntityAtRandomPosition(entity, z);
	    }
	}

	for (let z = 0; z < map.depth; z++) {
	    for (let i = 0; i < 10; i++) {
		let item = itemRepository.create('dagger');
		map.addItemAtRandomPosition(item, z);
	    }
	}
	
	map.engine.start();
    }
    
    set player(player) {
	this._player = player;
    }
    
    get player() {
	return this._player;
    }
    
    set subscreen(screen) {
	this._subscreen = screen;
    }
    
    get subscreen() {
	return this._subscreen;
    }
    
    enter() {
    }
    
    getScreenOffsets(width, height) {
	let dx = Math.max(0, this.player.x - (width / 2));
	dx = Math.min(dx, this.player.map.width - width);
	let dy = Math.max(0, this.player.y - (height / 2));
	dy = Math.min(dy, this.player.map.height - height);
	return {
	    x : dx,
	    y : dy
	};
    }
    
    render(game, display) {
	if (this.subscreen) {
	    this.subscreen.render(game, display);
	    return;
	}
	
	this.renderTiles(game, display);

	var messages = this.player.messages;
	var messageY = 0;
	for (var i = 0; i < messages.length; i++) {
	    messageY += display.drawText(0, messageY, '%c{white}%b{black}' + messages[i]);
	}    
    }
    
    renderTiles(game, display) {
	super.render(game, display);
	let screenWidth = game.screenWidth;
	let screenHeight = game.screenHeight;
	let offsets = this.getScreenOffsets(screenWidth, screenHeight);
	let topLeftX = offsets.x;
	let topLeftY = offsets.y;
	
	let visibleCells = {};
	let map = this.player.map;
	let currentDepth = this.player.z;

	map.getFov(currentDepth).compute(this.player.x, this.player.y, this.player.sightRadius,
		function(x, y, radius, visibility) {
		    visibleCells[x + "," + y] = true;
		    map.setExplored(x, y, currentDepth, true);
		});
	
	for (let x = topLeftX; x < topLeftX + screenWidth; x++) {
	    for (let y = topLeftY; y < topLeftY + screenHeight; y++) {
		if (map.getExplored(x, y, currentDepth)) {
		    let glyph = map.getTile(x, y, currentDepth);
		    let foreground = glyph.foreground;
		    let background = glyph.background;
		    if (visibleCells[x + ',' + y]) {
    		    	var items = map.getItemsAt(x, y, currentDepth);
    		    	if (items) {
    		    	    glyph = items[items.length - 1];
    		    	}
    		    	if (map.getEntityAt(x, y, currentDepth)) {
        		    glyph = map.getEntityAt(x, y, currentDepth);
    		    	}
			foreground = glyph.foreground;
		    } else {
			foreground = '#222';
			background = '#111';
		    }
		    display.draw(x - topLeftX, y - topLeftY, glyph.character, foreground, background);
		}
	    }
	}
    }
    
    handleInput(inputType, inputData, game) {
	if (this.subscreen) {
	    this.subscreen.handleInput(inputType, inputData, game);
	    return;
	}
	if (inputType === 'keydown') {
	    if (inputData.keyCode === ROT.VK_LEFT) {
		this.move(-1, 0, 0);
	    } else if (inputData.keyCode === ROT.VK_RIGHT) {
		this.move(1, 0, 0);
	    } else if (inputData.keyCode === ROT.VK_UP) {
		this.move(0, -1, 0);
	    } else if (inputData.keyCode === ROT.VK_DOWN) {
		this.move(0, 1, 0);
	    } else if (inputData.keyCode === ROT.VK_I) {
		if (this.player.items.filter(function(x) {
		    return x;
		}).length === 0) {
		    this.player.sendMessage("You are not carrying anything!");
		    game.refresh();
		} else {
		    screen = new InventoryScreen(this);
		    screen.setup(this.player, this.player.items);
		    this.subscreen = screen;
		    game.refresh();
		}
		return;
	    } else {
		return;
	    }
	    this.player.map.engine.unlock();
	}
    }
    
    
    move(dX, dY, dZ) {
	let newX = this.player.x + dX;
	let newY = this.player.y + dY;
	let newZ = this.player.z + dZ;
	this.player.move(newX, newY, newZ, this.player.map);
    }
    
}

class InventoryScreen extends ItemsScreen {
    
    constructor(parentScreen) {
	super( { caption : 'Inventory', canSelect : false, parent : parentScreen } );
    }
    
}

