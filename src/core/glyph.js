Game.Glyph = function(properties) {
    properties = properties || {};
    this._character = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
};

Game.Glyph.prototype.getCharacter = function() {
    return this._character;
};

Game.Glyph.prototype.getBackground = function() {
    return this._background;
};

Game.Glyph.prototype.getForeground = function() {
    return this._foreground;
};

Game.Glyph.prototype.getRepresentation = function() {
    return '%c{' + this._foreground + '}%b{' + this._background + '}' + this._character + '%c{white}%b{black}';
};
