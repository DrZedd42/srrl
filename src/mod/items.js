itemRepository = new Repository('items');


class Dagger extends Item {
    
    constructor(properties) {
	super({
	    name : 'dagger',
	    character : ')',
	    foreground : 'gray',
	    attackValue : 5,
	    wieldable : true
	});
    }
    
}

itemRepository.define('dagger', Dagger);


