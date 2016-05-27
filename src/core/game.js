class Game {

    constructor(width, height) {

	this._currentScreen = null;
	
	this._screenWidth = width;
	this._screenHeight = height;
    
	this._display = new ROT.Display({
	    width : this._screenWidth,
	    height : this._screenHeight + 1,
	    fontSize : 16
	});
	
	let game = this;
	let bindEventToScreen = function(event) {
	    window.addEventListener(event, function(e) {
		if (game._currentScreen !== null) {
		    game._currentScreen.handleInput(event, e, game);
		}
	    });
	};
	bindEventToScreen('keydown');
	bindEventToScreen('keypress');
    }
    
    get display() {
	return this._display;
    }
    
    get screenHeight() {
	return this._screenHeight;
    }
    
    get screenWidth() {
	return this._screenWidth;
    }
    
    get currentScreen() {
	return this._currentScreen;
    }
    
    refresh() {
	this.display.clear();
	this.currentScreen.render(this, this.display);
    }

    switchScreen(screen) {
	if (this._currentScreen !== null) {
	    this._currentScreen.exit();
	}
	this.display.clear();
	this._currentScreen = screen;
	if (this.currentScreen !== null) {
	    this.currentScreen.enter();
	    this.refresh();
	}
    }
    
}
