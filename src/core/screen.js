class Screen {

    enter() {	
    }

    exit() {
    }

    render(game, display) {
    }

    handleInput(inputType, inputData, game) {
    }
    
}

class ItemsScreen extends Screen {
    
    constructor(properties) {
	super(properties);
	
	properties = properties || {};
	this._parentScreen = properties['parent'];
	
	this._caption = properties['caption'];
	this._okFunction = properties['ok'];
	this._isAcceptableFunction = properties['isAcceptable'] || function(x) {
	    return x;
	}
	this._canSelectItem = properties['canSelect'];
	this._canSelectMultipleItems = properties['canSelectMultipleItems'];
	this._hasNoItemOption = properties['hasNoItemOption'];
    }

    get parentScreen() {
	return this._parentScreen;
    }
    
    get caption() {
	return this._caption;
    }
    
    get okFunction() {
	return this._okFunction;
    }
    
    get isAcceptableFunction() {
	return this._isAcceptableFunction;
    }
    
    get canSelectItem() {
	return this._canSelectItem;
    }
    
    get canSelectMultipleItems() {
	return this._canSelectMultipleItems;
    }
    
    get hasNoItemOption() {
	return this._hasNoItemOption;
    }
    
    get items() {
	return this._items;
    }
    
    setup(player, items) {
	this._player = player;
	let count = 0;
	let that = this;
    	this._items = items.map(function(item) {
    	    if (that._isAcceptableFunction(item)) {
    		count++;
    		return item;
    	    } else {
    		return null;
    	    }
	});
    	this._selectedIndices = {};
	return count;
    }
    
    render(game, display) {
	let letters = 'abcdefghijklmnopqrstuvwxyz';
	display.drawText(1, 1, this.caption);
	if (this.hasNoItemOption) {
	    display.drawText(1, 3, '0 - no item');
	}
	let row = 0;
	if(this.items) {
	    for (let i = 0; i < this.items.length; i++) {
    	    	if (this.items[i]) {
    	    	    let letter = letters.substring(i, i + 1);
    	    	    let selectionState = (this.canSelectItem && this.canSelectMultipleItems && this.selectedIndices[i]) ? '+' : '-';
    	    	    let suffix = '';
    	    	    display.drawText(1, 3 + row, letter + ' ' + selectionState + ' ' + this.items[i].describe + suffix);
    	    	    row++;
    	    	}
	    }
	}
    }
    
    handleInput(inputType, inputData, game) {
	if (inputType === 'keydown') {
	    if (inputData.keyCode === ROT.VK_ESCAPE || nputData.keyCode === ROT.VK_RETURN) {
		this.parentScreen.subscreen = undefined;
	    }
	}
	game.refresh();
    }
    
}

