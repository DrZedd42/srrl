class Glyph {
    
    constructor(properties) {
	properties = properties || {};
	this._character = properties['character'] || ' ';
	this._foreground = properties['foreground'] || 'white';
	this._background = properties['background'] || 'black';
    }
    
    get character() {
	return this._character;
    }
    
    get foreground() {
	return this._foreground;
    }
    
    get background() {
	return this._background;
    }

    display() {
	return '%c{' + this._foreground + '}%b{' + this._background + '}' + this._character + '%c{white}%b{black}';
    }
    
}
