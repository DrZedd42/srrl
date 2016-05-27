class Archetype {
    
    constructor(properties) {
	properties = properties || {};
	this._name = properties.name;
    }
    
    set name(name) {
	this._name = name;
    }
    
    get name() {
	return this._name;
    }
    
}
