/* 
 * Engine
 */
var Engine = function(partie, tools) {

	// Retourne le hashcode de la partie après exécution de l'action
	this.applyPlayerAction = function(playerAction) {
		switch(playerAction.actionType) {
			case PLAYER_ACTION_TYPE.SELECT:
				var targetPiece = playerAction.targetPiece;
				console.log('Nouvelle piece selectionnee');
				partie.setSelectedPiece(targetPiece);
				break;
			case PLAYER_ACTION_TYPE.MOVE:
				var targetCase = playerAction.targetCase;
				var targetPiece = playerAction.targetPiece;
				console.log('Déplacement');
				_movePieceToCase(targetPiece, targetCase);
				break;
			case PLAYER_ACTION_TYPE.LOAD:
				var pieceTransporter = playerAction.pieceTransporter;
				var pieceACharger = playerAction.pieceACharger;
				console.log('Chargement');
				_chargePiece(pieceTransporter, pieceACharger)
				break;
			case PLAYER_ACTION_TYPE.UNLOAD:
				var pieceTransporter = playerAction.pieceTransporter;
				var pieceADecharger = playerAction.pieceADecharger;
				var targetCase = playerAction.targetCase;
				console.log('Déchargement');
				_dechargePiece(pieceTransporter, pieceADecharger, targetCase);
				break;
			case PLAYER_ACTION_TYPE.ATTACK:
				var targetPiece = playerAction.targetPiece;
				console.log('Attaque');
				_attack(targetPiece);
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
	var _movePieceToCase = function(piece, targetCase) {
		if (piece.pieceType == PIECE_TYPE.BARGE) {
			// Si c'est une case adjacente à l'arriere de la barge, on tourne, 
			// ATTENTION on ne peux pas utiliser this.arePieceAndTargetAdjacent 
			//car il tient compte du fait que c'est une barge alors qu'on cherche 
			//juste à savoir si c'est la base de la barge qui est adjacente à la case ici
			if (tools.areCoordinatesAdjacent(piece.x, piece.y, targetCase.x, targetCase.y)) {
				piece.orientation = tools.getOrientation(piece, targetCase);
			} else {
				// Sinon on avance.
				// La case cible et la case avant de la barge sont forcément adjacentes ici
				var caseAvantBargeCoords = tools.getCoordsCaseAvantBarge(piece);
				var nextOrientation = tools.getOrientation(caseAvantBargeCoords, targetCase);
				_setPieceToCase(piece, caseAvantBargeCoords);
				piece.orientation = nextOrientation;
			}
		} else {
			piece.orientation = tools.getOrientation(piece, targetCase);
			_setPieceToCase(piece, targetCase);
		}
		partie.removeToursPoints(1);
	}
	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _chargePiece = function(pieceTransporter, pieceACharger) {
		console.log('Chargement de ' + pieceACharger.pieceType.name + ' dans ' + pieceTransporter.pieceType.name);
		// if (pieceTransporter.getContenu() == null) {
		// 	pieceTransporter.getContenu() = [];
		// }

		// On déplace le tank du plateau de la partie au contenu du transporteur
		pieceTransporter.addContenu(pieceACharger);
		var indexInPieces = partie.getPieces().indexOf(pieceACharger);
		partie.getPieces().splice(indexInPieces, 1);
		partie.setSelectedPiece(pieceTransporter);
		partie.removeToursPoints(1);
	}
	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _dechargePiece = function(pieceTransporter, pieceADecharger, targetCase) {
		if (pieceTransporter.getContenu() == null) {
			throw 'Impossible de décharger car le ' + pieceTransporter.pieceType.name + ' est vide.';
		}
		var index = pieceTransporter.getContenu().indexOf(pieceADecharger);
		if (index == -1) {
			throw 'Impossible de décharger un ' + pieceADecharger.pieceType.name + ' car le ' + pieceTransporter.pieceType.name + " n'en contient pas";
		} else {
			partie.getPieces().push(pieceADecharger);
			pieceTransporter.getContenu().splice(index, 1);
			_setPieceToCase(pieceADecharger, targetCase);
			partie.setSelectedPieceSoute(null);
		}
		partie.removeToursPoints(1);
	}

	/*
	 * @ActionService
	 * @dependsOn(@PartieService)
	 */
	var _attack = function(piece) {
		// TODO Validation :
		// - Si plus de 2 destroyers, comment faire interagir le joueur
		var targetCase = partie.getCasePiece(piece);
		var piecesAttacking = partie.getEnemiesThatCanAttackInRange(targetCase.x, targetCase.y, piece.player);
		// Deduction d'une munition
		// TODO si + de 2 attaquants possibles tt le monde perd une munition
		piecesAttacking.forEach(function(pieceAttacking) {
			pieceAttacking.getContenu().splice(0,1);
		});

		// C'est pas elegant mais ça sert à attendre les 4s de l'animation de 
		// l'explosion qui disparait en CSS
		setTimeout(function() {
			console.log('Piece: ' + piece.pieceType.name);
		    targetCase.explose = false;
		}, 4000);

		partie.removePiece(piece);

		// TODO Déplacer dans DisplayService ça sera pas du luxe vu comme c crado
		targetCase.explose = true;
		// Si la piece attaquee etait la piece selectionne du joueur, on deselectionne
		// if (piece == piece.player.selectedPiece) {
		// 	piece.player.selectedPiece = null;
		// }

		partie.removeToursPoints(2);
		console.log('Destruction de la piece ' + piece.pieceType.name + ' de ' + partie.getPlayer(piece).name + ' par ' + partie.getPlayer().name);
	}

	/*
	 * @EngineService
	 */
	 var _setPieceToCase = function(piece, hexagonalCase) {
		piece.x = hexagonalCase.x;
		piece.y = hexagonalCase.y;
	}
}
