Game.Race = function(properties) {
    this.properties = properties || {}; 
    this.name = properties.name;
}

Game.Race.Human = function() {
    var properties = {	
	name : "Human"
    }
    Game.Race.call(this, properties);
}
Game.Race.Human.extend(Game.Race);


Game.Race.Ork = function() {
    var properties = {	
	name : "Ork"
    }
    Game.Race.call(this, properties);
}
Game.Race.Ork.extend(Game.Race);

Game.Race.Troll = function() {
    var properties = {	
	name : "Troll"
    }
    Game.Race.call(this, properties);
}
Game.Race.Troll.extend(Game.Race);

Game.Race.Elf = function() {
    var properties = {	
	name : "Elf"
    }
    Game.Race.call(this, properties);
}
Game.Race.Elf.extend(Game.Race);

Game.Race.Dwarf = function() {
    var properties = {	
	name : "Dwarf"
    }
    Game.Race.call(this, properties);
}
Game.Race.Dwarf.extend(Game.Race);

