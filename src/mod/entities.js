class Player extends PlayerActor(Sight(Attacker(Defender(InventoryHolder(MessageRecipient(Entity)))))) {
    
    constructor() {
	let properties = {
	    name : 'human (you)',
	    character : '@',
	    foreground : 'white',
	    sightRadius : 9
	};
	super(properties);
    }
    
}

class Drone extends TaskActor(Sight(Attacker(Defender(MessageRecipient(Entity))))) {
    
    constructor() {
	let properties = {
	    name : 'drone',
	    character : 'd',
	    foreground : 'blue',
	    maxHp : 1,
	    tasks : ['hunt','wander']
	};
	super(properties);
    }
    
}

entityRepository = new Repository('entities');

entityRepository.define('drone', Drone);
