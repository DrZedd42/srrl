class DynamicGlyph extends Glyph {
    
    constructor( properties ) {
	super(properties);
	
	properties = properties || {};
	
	this._name = properties['name'] || '';
	
	this._mixin_ids = new Array();
	
	this._listeners = {};
    }
    
    hasMixin(name) {
	return this.mixinIds.indexOf(name) > -1;
    }

    set listeners(listeners) {
	this._listeners = listeners
    }
    
    get listeners() {
	return this._listeners;
    }
    
    set name(name) {
	this._name = name;
    }
    
    get name() {
	return this._name;
    }
    
    get describe() {
	return this._name;
    };

    set mixinIds(mixinIds) {
	this._mixin_ids = mixinIds;
    }
    
    get mixinIds() {
	return this._mixin_ids;
    }
    
    describeA(capitalize) {
	var prefixes = capitalize ? [ 'A', 'An' ] : [ 'a', 'an' ];
	var string = this.describe;
	var firstLetter = string.charAt(0).toLowerCase();
	var prefix = 'aeiou'.indexOf(firstLetter) >= 0 ? 1 : 0;
	return prefixes[prefix] + ' ' + string;
    }
    
    describeThe(capitalize) {
	var prefix = capitalize ? 'The' : 'the';
	return prefix + ' ' + this.describe();
    }
    
    raiseEvent(event) {
	if (!this.listeners[event]) {
	    return;
	}
	var args = Array.prototype.slice.call(arguments, 1)
	for (var i = 0; i < this._listeners[event].length; i++) {
	    this.listeners[event][i].apply(this, args);
	}
    }
    
}
