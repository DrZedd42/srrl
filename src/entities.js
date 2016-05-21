Game.Entity.Player = {

    name : 'human (you)',
    character : '@',
    foreground : 'white',
    sightRadius : 10,
    inventorySize : 26,
    maxHp : 100,
    race : null,
    archetype : null,
    mixins : [ Game.EntityMixins.Player, Game.EntityMixins.Sight ]

}

Game.Entity.Johnson = {

    name : 'Johnson',
    character : 'J',
    foreground : 'yellow',
    mixins : [ Game.EntityMixins.QuestGiver ]

}
