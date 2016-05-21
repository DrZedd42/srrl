Game.Item = function(properties) {
    properties = properties || {};
    Game.DynamicGlyph.call(this, properties);
};

Game.Item.extend(Game.DynamicGlyph);

Game.ItemRepository = new Game.Repository('items', Game.Item);
