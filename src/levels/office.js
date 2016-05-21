Game.Map.Office = function(tiles) {

    Game.Map.call(this, tiles);

    for (var z = 0; z < this._depth; z++) {
	for (var i = 0; i < 10; i++) {
	}
    }

};

Game.Map.Office.extend(Game.Map);
