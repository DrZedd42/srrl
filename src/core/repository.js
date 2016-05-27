class Repository {
    
    constructor(name) {
	this._name = name;
	this._classes = {};
	this._randomClasses = {};
    }
    
    get name() {
	return this._name;
    }
    
    get classes() {
	return this._classes;
    }
    
    get randomClasses() {
	return this._randomClasses;
    }
    
    define(name, clazz, options) {
	this.classes[name] = clazz;
	let disableRandomCreation = options && options['disableRandomCreation'];
	if (!disableRandomCreation) {
	    this.randomClasses[name] = clazz;
	}
    }
    
    create(name, properties) {
	if (!this.classes[name]) {
	    throw new Error("No class named '" + name + "' in repository '" + this.name + "'");
	}
	return new this.classes[name];
    }
    
    createRandom () {
	return this.create(Object.keys(this.randomClasses).random());
    }

}


