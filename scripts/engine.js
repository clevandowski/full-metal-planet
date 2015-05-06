/* 
 * Engine
 */
var Engine = function(fmpConstants, partie, tools) {

	// Retourne le hashcode de la partie après exécution de l'action
	this.applyPlayerAction = function(playerAction) {
		switch(playerAction.actionType.value) {
			case fmpConstants.PLAYER_ACTION_TYPE.MOVE.value:
				var targetCase = playerAction.targetCase;
				var targetPieceId = playerAction.targetPieceId;
				console.log('Déplacement');
				_movePieceToCase(targetPieceId, targetCase);
				break;
			case fmpConstants.PLAYER_ACTION_TYPE.LOAD.value:
				var pieceTransporterId = playerAction.pieceTransporterId;
				var pieceAChargerId = playerAction.pieceAChargerId;
				console.log('Chargement');
				_chargePiece(pieceTransporterId, pieceAChargerId);
				break;
			case fmpConstants.PLAYER_ACTION_TYPE.UNLOAD.value:
				var pieceTransporterId = playerAction.pieceTransporterId;
				var pieceADechargerId = playerAction.pieceADechargerId;
				var targetCase = playerAction.targetCase;
				console.log('Déchargement');
				_dechargePiece(pieceTransporterId, pieceADechargerId, targetCase);
				break;
			case fmpConstants.PLAYER_ACTION_TYPE.ATTACK.value:
				var targetPieceId = playerAction.targetPieceId;
				console.log('Attaque');
				_attack(targetPieceId);
				break;
			case fmpConstants.PLAYER_ACTION_TYPE.END_OF_TURN.value:
				partie.setTourToNextPlayer();
				break;
			default:
				throw "Unknow playerAction: " + JSON.stringify(playerAction);
				break;
		}
	}

	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _movePieceToCase = function(pieceId, targetCase) {
		var piece = partie.getPieceById(pieceId);
		var nextOrientation;
		var coords;
		if (piece.pieceType.value == fmpConstants.PIECE_TYPE.BARGE.value) {
			// Si c'est une case adjacente à l'arriere de la barge, on tourne, 
			// ATTENTION on ne peux pas utiliser this.arePieceAndTargetAdjacent 
			// car il tient compte du fait que c'est une barge alors qu'on cherche 
			// juste à savoir si c'est la base de la barge qui est adjacente à la case ici
			if (tools.areCoordinatesAdjacent(piece.x, piece.y, targetCase.x, targetCase.y)) {
				nextOrientation = tools.getOrientation(piece, targetCase);
				coords = { x: piece.x, y: piece.y };
			} else {
				// Sinon on avance.
				// La case cible et la case avant de la barge sont forcément adjacentes ici
				coords = tools.getCoordsCaseAvantBarge(piece);
				nextOrientation = tools.getOrientation(coords, targetCase);
			}
		} else {
			nextOrientation = tools.getOrientation(piece, targetCase);
			coords = {x: targetCase.x, y: targetCase.y};
		}
		partie.setPieceToCase(pieceId, coords, nextOrientation);
		partie.removeToursPoints(1);
	}
	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _chargePiece = function(pieceTransporterId, pieceAChargerId) {
		partie.chargePiece(pieceTransporterId, pieceAChargerId);
		partie.removeToursPoints(1);
	}
	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _dechargePiece = function(pieceTransporterId, pieceADechargerId, targetCase) {
		partie.dechargePiece(pieceTransporterId, pieceADechargerId, targetCase);
		partie.removeToursPoints(1);
	}

	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _attack = function(pieceId) {
		var piece = partie.getPieceById(pieceId);
		var targetCase = partie.getCasePieceId(pieceId);
		var piecesIdAttacking = partie.getEnemiesThatCanAttackInRange(targetCase.x, targetCase.y, piece.playerId);
		// Deduction d'une munition
		// TODO Si plus de 2 destroyers, comment faire interagir le joueur
		// TODO ATTENTION actuellement si + de 2 attaquants possibles tt le monde perd une munition
		piecesIdAttacking.forEach(function(pieceIdAttacking) {
			partie.removeAmmo(pieceIdAttacking);
		});
		console.log('Destruction de la piece ' + piece.pieceType.name + ' de ' + partie.getPlayer(piece.id).name + ' par ' + partie.getPlayer().name);
		partie.removePiece(pieceId);
		partie.removeToursPoints(2);
	}

	/*
	 * @EngineService
	 */
	var _setPieceToCase = function(piece, hexagonalCase) {
		partie.setPieceToCase(piece.id, hexagonalCase);
	}
}

// node.js ?
if (typeof module !== 'undefined' && module.exports) {
	module.exports.Engine = Engine;
}