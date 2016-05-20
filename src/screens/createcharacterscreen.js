Game.Screen.createCharacterScreen = function(properties) {
    Game.Screen.call(this, properties);

    this._selectedRace = null;
    this._selectedArchetype = null;

    this._races = [ new Game.Race.Human(), new Game.Race.Ork(), new Game.Race.Troll(), new Game.Race.Elf(),
	    new Game.Race.Dwarf() ];

    this._archetypes = [ new Game.Archetype.StreetSamurai(), new Game.Archetype.Rigger(), new Game.Archetype.Decker(),
	    new Game.Archetype.Magician(), new Game.Archetype.Shaman(), new Game.Archetype.Adept() ];
}

Game.Screen.createCharacterScreen.extend(Game.Screen);

Game.Screen.createCharacterScreen.prototype.render = function(display) {
    display.drawText(26, 1, "%c{yellow}Create a character");

    var array;
    if (!this._selectedRace) {
	display.drawText(2, 3, "Races");
	array = this._races;
    } else {
	display.drawText(2, 3, "Archetypes");
	array = this._archetypes
    }

    for (var i = 0; i < array.length; i++) {
	display.drawText(2, 5 + (i * 2), String.fromCharCode(97 + i) + ") " + array[i].name);
    }

}

Game.Screen.createCharacterScreen.prototype.handleInput = function(inputType, inputData) {
    if (inputType === 'click') {
	var delta = Game.getDisplay().eventToPosition(inputData)
	var array;
	if (!this._selectedRace) {
	    array = this._races;
	} else {
	    array = this._archetypes
	}
	for (var i = 0; i < array.length; i++) {
	    if (delta[1] == 5 + (i * 2)) {
		if (!this._selectedRace) {
		    this._selectedRace = this._races[i];
		    Game.refresh();
		} else {
		    this._selectedArchetype = array[i];
		    Game.switchScreen(new Game.Screen.playScreen({
			race : this._selectedRace,
			archetype : this._selectedArchetype
		    }));
		}
	    }
	}
    }
    if (inputType === 'keypress') {
	var array;
	if (!this._selectedRace) {
	    array = this._races;
	} else {
	    array = this._archetypes
	}
	for (var i = 0; i < array.length; i++) {
	    if (inputData.keyCode == (97 + i)) {
		if (!this._selectedRace) {
		    this._selectedRace = this._races[i];
		    Game.refresh();
		} else {
		    this._selectedArchetype = array[i];
		    Game.switchScreen(new Game.Screen.playScreen({
			race : this._selectedRace,
			archetype : this._selectedArchetype
		    }));
		}
	    }
	}
    }
};
