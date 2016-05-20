Game.Archetype = function(properties) {
    this.properties = properties || {};
    this.name = properties.name;
}

Game.Archetype.StreetSamurai = function() {
    var properties = {
	name : "Street Samurai"
    }
    Game.Archetype.call(this, properties);
}
Game.Archetype.StreetSamurai.extend(Game.Archetype);

Game.Archetype.Rigger = function() {
    var properties = {
	name : "Rigger"
    }
    Game.Archetype.call(this, properties);
}
Game.Archetype.Rigger.extend(Game.Archetype);

Game.Archetype.Decker = function() {
    var properties = {
	name : "Decker"
    }
    Game.Archetype.call(this, properties);
}
Game.Archetype.Decker.extend(Game.Archetype);

Game.Archetype.Magician = function() {
    var properties = {
	name : "Magician"
    }
    Game.Archetype.call(this, properties);
}
Game.Archetype.Magician.extend(Game.Archetype);

Game.Archetype.Shaman = function() {
    var properties = {
	name : "Shaman"
    }
    Game.Archetype.call(this, properties);
}
Game.Archetype.Shaman.extend(Game.Archetype);

Game.Archetype.Adept = function() {
    var properties = {
	name : "Adept"
    }
    Game.Archetype.call(this, properties);
}
Game.Archetype.Adept.extend(Game.Archetype);

