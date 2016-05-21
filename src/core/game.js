var Game = {

    _display : null,
    _currentScreen : null,
    _screenWidth : 0,
    _screenHeight : 0,

    init : function(screenWidth, screenHeight) {
	this._screenWidth = screenWidth;
	this._screenHeight = screenHeight;
	this._display = new ROT.Display({
	    width : this._screenWidth,
	    height : this._screenHeight + 1,
	    fontSize : 16
	});
	var game = this;
	var bindEventToScreen = function(event) {
	    window.addEventListener(event, function(e) {
		if (game._currentScreen !== null) {
		    game._currentScreen.handleInput(event, e);
		}
	    });
	};
	bindEventToScreen('click');
	bindEventToScreen('keydown');
	bindEventToScreen('keypress');
    },

    getDisplay : function() {
	return this._display;
    },

    getScreenWidth : function() {
	return this._screenWidth;
    },

    getScreenHeight : function() {
	return this._screenHeight;
    },

    refresh : function() {
	this._display.clear();
	this._currentScreen.render(this._display);
    },
    
    getCurrentScreen : function() {
	return this._currentScreen;
    },

    switchScreen : function(screen) {
	if (this._currentScreen !== null) {
	    this._currentScreen.exit();
	}
	this.getDisplay().clear();
	this._currentScreen = screen;
	if (this._currentScreen !== null) {
	    this._currentScreen.enter();
	    this.refresh();
	}
    }

};
