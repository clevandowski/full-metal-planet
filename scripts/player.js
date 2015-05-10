var Player = function(id, name, color) {
	this.id = id;
	this.name = name;
	this.pointsEconomise = 0;
	this.color = color;
}
// node.js ?
if (typeof module !== 'undefined' && module.exports) {
 	module.exports.Player = Player;
}