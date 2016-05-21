Game.Screen.createScreen = {

    _selectedRace : null,
    _selectedArchetype : null,

    _races : [],
    _archetypes : [],

    enter : function() {
	this._races = [ new Game.Race.Human(), new Game.Race.Ork(), new Game.Race.Troll(), new Game.Race.Elf(),
		new Game.Race.Dwarf() ];

	this._archetypes = [ new Game.Archetype.StreetSamurai(), new Game.Archetype.Rigger(),
		new Game.Archetype.Decker(), new Game.Archetype.Magician(), new Game.Archetype.Shaman(),
		new Game.Archetype.Adept() ];
    },

    exit : function() {
    },

    play : function() {
	var screen = Object.assign({}, Game.Screen.playScreen);
	Game.switchScreen(screen);
	var player = new Game.Entity(Game.Entity.Player);
	player._race = this._selectedRace;
	screen.update(player);
    },

    render : function(display) {
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
    },

    handleInput : function(inputType, inputData) {
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
			this.play();
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
			this.play();
		    }
		}
	    }
	}
    }

};
