/* 
 * Engine
 */
var Engine = function(partie, tools) {

	// Retourne le hashcode de la partie après exécution de l'action
	this.applyPlayerAction = function(playerAction) {
		switch(playerAction.actionType) {
			case PLAYER_ACTION_TYPE.MOVE:
				var targetCase = playerAction.targetCase;
				var targetPieceId = playerAction.targetPieceId;
				console.log('Déplacement');
				_movePieceToCase(targetPieceId, targetCase);
				break;
			case PLAYER_ACTION_TYPE.LOAD:
				var pieceTransporterId = playerAction.pieceTransporterId;
				var pieceAChargerId = playerAction.pieceAChargerId;
				console.log('Chargement');
				_chargePiece(pieceTransporterId, pieceAChargerId)
				break;
			case PLAYER_ACTION_TYPE.UNLOAD:
				var pieceTransporterId = playerAction.pieceTransporterId;
				var pieceADechargerId = playerAction.pieceADechargerId;
				var targetCase = playerAction.targetCase;
				console.log('Déchargement');
				_dechargePiece(pieceTransporterId, pieceADechargerId, targetCase);
				break;
			case PLAYER_ACTION_TYPE.ATTACK:
				var targetPieceId = playerAction.targetPieceId;
				console.log('Attaque');
				_attack(targetPieceId);
				break;
			case PLAYER_ACTION_TYPE.END_OF_TURN:
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
		if (piece.pieceType == PIECE_TYPE.BARGE) {
			// Si c'est une case adjacente à l'arriere de la barge, on tourne, 
			// ATTENTION on ne peux pas utiliser this.arePieceAndTargetAdjacent 
			// car il tient compte du fait que c'est une barge alors qu'on cherche 
			// juste à savoir si c'est la base de la barge qui est adjacente à la case ici
			if (tools.areCoordinatesAdjacent(piece.x, piece.y, targetCase.x, targetCase.y)) {
				nextOrientation = tools.getOrientation(piece, targetCase);
				coords = {x: piece.x, y: piece.y};
			} else {
				// Sinon on avance.
				// La case cible et la case avant de la barge sont forcément adjacentes ici
				coords = tools.getCoordsCaseAvantBarge(piece);
				nextOrientation = tools.getOrientation(coords, targetCase);
				// partie.setPieceToCase(pieceId, coords, nextOrientation);
				// piece.orientation = nextOrientation;
			}
		} else {
			nextOrientation = tools.getOrientation(piece, targetCase);
			coords = {x: targetCase.x, y: targetCase.y};
			// partie.setPieceToCase(pieceId, targetCase, nextOrientation);
		}
		partie.setPieceToCase(pieceId, coords, nextOrientation);
		partie.removeToursPoints(1);
	}
	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _chargePiece = function(pieceTransporterId, pieceAChargerId) {
		// console.log('Chargement de ' + pieceACharger.pieceType.name + ' dans ' + pieceTransporter.pieceType.name);

		partie.chargePiece(pieceTransporterId, pieceAChargerId);
		partie.removeToursPoints(1);
	}
	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _dechargePiece = function(pieceTransporterId, pieceADechargerId, targetCase) {
		// if (pieceTransporter.getContenu() == null) {
		// 	throw 'Impossible de décharger car le ' + pieceTransporter.pieceType.name + ' est vide.';
		// }
		// var index = pieceTransporter.getContenu().indexOf(pieceADecharger);
		// if (index == -1) {
		// 	throw 'Impossible de décharger un ' + pieceADecharger.pieceType.name + ' car le ' + pieceTransporter.pieceType.name + " n'en contient pas";
		// } else {
		// 	partie.getPieces().push(pieceADecharger);
		// 	pieceTransporter.getContenu().splice(index, 1);
		// 	_setPieceToCase(pieceADecharger, targetCase);
		// }
		partie.dechargePiece(pieceTransporterId, pieceADechargerId, targetCase);
		partie.removeToursPoints(1);
	}

	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _attack = function(pieceId) {
		var piece = partie.getPieceById(pieceId);
		var targetCase = partie.getCasePiece(piece);
		var piecesAttacking = partie.getEnemiesThatCanAttackInRange(targetCase.x, targetCase.y, piece.playerId);
		// Deduction d'une munition
		// TODO Si plus de 2 destroyers, comment faire interagir le joueur
		// TODO ATTENTION actuellement si + de 2 attaquants possibles tt le monde perd une munition
		piecesAttacking.forEach(function(pieceAttacking) {
			pieceAttacking.nbAmmos--;
		});

		console.log('Destruction de la piece ' + piece.pieceType.name + ' de ' + partie.getPlayer(piece.id).name + ' par ' + partie.getPlayer().name);
		partie.removePiece(pieceId);
		partie.removeToursPoints(2);
	}

	/*
	 * @EngineService
	 */
	var _setPieceToCase = function(piece, hexagonalCase) {
		// piece.x = hexagonalCase.x;
		// piece.y = hexagonalCase.y;
		partie.setPieceToCase(piece.id, hexagonalCase);
	}
}
