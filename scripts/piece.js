/*
 * @Import(constant.js)
 */
var Piece = function(playerId, pieceType, x, y, orientation) {
	this.id = Piece.sequence();
	this.playerId = playerId;
	this.pieceType = pieceType;
	this.x = x;
	this.y = y;
	this.contenu = [];

	if (this.pieceType.destroyer) {
		this.nbAmmos = 2;
	} else {
		this.nbAmmos = 0;
	}

	if (orientation == null) {
		// ORIENTATION.S;
		// TODO A Remplacer par la valeur 'S' lorsque je referais tous les stockage des enums par id et non plus par référence.
		this.orientation = { value: 'S', name: 'sud', cssName: 'orientation-sud', next: 'SO', previous: 'SE' }
	} else {
		this.orientation = orientation;
	}
}

Piece.sequenceId = 0;
Piece.sequence = function() {
	return Piece.sequenceId++;
}

// node.js ?
if (typeof module !== 'undefined' && module.exports) {
	module.exports.Piece = Piece;
}
