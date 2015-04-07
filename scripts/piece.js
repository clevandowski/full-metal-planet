/*
 * @Import(constant.js)
 */
var Piece = function(playerId, pieceType, x, y, orientation) {
	this.playerId = playerId;
	this.pieceType = pieceType;
	this.x = x;
	this.y = y;
	this.contenu = [];

	if (orientation == null) {
		this.orientation = ORIENTATION.S;
	} else {
		this.orientation = orientation;
	}
	this.addContenu = function(piece) {
		if (piece == null) {
			throw 'Piece vide !';
		} else {
			this.contenu.push(piece);
		}
	}
	this.getContenu = function() {
		return this.contenu;
	}
}
