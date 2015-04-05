var Referee = function(partie, tools) {

	this.validatePlayerAction = function(playerAction) {
		switch (playerAction.actionType) {
			case PLAYER_ACTION_TYPE.SELECT:
				return { success: true };
				break;
			case PLAYER_ACTION_TYPE.MOVE:
				return this._validateMove(playerAction);
				break;
			case PLAYER_ACTION_TYPE.LOAD:
				return this._validateLoad(playerAction);
				break;
			case PLAYER_ACTION_TYPE.UNLOAD:
				return this._validateUnload(playerAction);
				break;
			case PLAYER_ACTION_TYPE.ATTACK:
				return this._validateAttack(playerAction);
				break;
			case PLAYER_ACTION_TYPE.END_OF_TURN:
				return { success: true };
				break;
			default:
				throw "Unknow playerAction: " + JSON.stringify(playerAction);
				break;
		}
	}

	this._validateLoad = function(playerAction) {
		var pieceTransporter = playerAction.pieceTransporter;
		var pieceACharger = playerAction.pieceACharger;

		var errorMessages = [];
		var validationStatus = true;

		if (! this._canTransporterChargePiece(pieceTransporter, pieceACharger)) {
			validationStatus = false;
			errorMessages.push(
				'Le transporteur n\'a plus suffisamment de place pour charger un ' + pieceACharger.pieceType.name);
		}
		// Si la pièce est enlisée en fonction de la marée
		if (! this._isPieceLoadable(pieceACharger)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce à charger est bloquée à marée ' + partie.currentMaree.name);
		}
		if (! this._isFreeFromEnemyFire(pieceTransporter)) {
			validationStatus = false;
			errorMessages.push(
				'Le transporteur est à portée de tir ennemi');
		}
		if (! this._isFreeFromEnemyFire(pieceACharger)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce à charger est à portée de tir ennemi');
		}
		return { 
			success: validationStatus,
			errorMessages: errorMessages
		}
	}

	this._validateUnload = function(playerAction) {
		var pieceTransporter = playerAction.pieceTransporter;
		var pieceADecharger = playerAction.pieceADecharger;
		var targetCase = playerAction.targetCase;

		var errorMessages = [];
		var validationStatus = true;

		if (! this._arePieceAndCaseAdjacent(pieceTransporter, targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'Il faut décharger sur une case adjacente au transporteur');
		}
		if (targetCase.caseType == CASE_TYPE.MER) {
			validationStatus = false;
			errorMessages.push(
				'Le déchargement en mer est interdit');			
		}
		if (! this._isFreeFromEnemyFire(pieceTransporter)) {
			validationStatus = false;
			errorMessages.push(
				'Le transporteur est à portée de tir ennemi');
		}
		if (! this._isFreeFromEnemyFire(targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La case ciblée pour décharger est à portée de tir ennemi');
		}
		return { 
			success: validationStatus,
			errorMessages: errorMessages
		}
	}

	this._validateAttack = function(playerAction) {
		var targetPiece = playerAction.targetPiece;
		var piecesAttacking = 
			partie.getEnemiesThatCanAttackInRange(targetPiece.x, targetPiece.y, targetPiece.player);

		var errorMessages = [];
		var validationStatus = true;

		if (this._isFreeFromEnemyFire(targetPiece)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce sélectionnée n\'appartient pas au joueur ' + partie.getPlayer().name);
		}
		if (partie.tourPoints < 2) {
			validationStatus = false;
			errorMessages.push(
				'Pas de réserve de point suffisant pour attaquer');
		}
		if (piecesAttacking.length > 2) {
			console.log('TODO: Pouvoir choisir les attaquants');
		}
		if (! this._isRemainingAmmoOnPiecesAttacking(piecesAttacking)) {
			validationStatus = false;
			errorMessages.push(
				'Pas assez de munitions pour attaquer');
		}
		// Attaque !
		if (! window.confirm('Attaquer l\'unité ?')) {
			validationStatus = false;
			errorMessages.push(
				'Le joueur a annulé l\'attaque');
		}

		return { 
			success: validationStatus,
			errorMessages: errorMessages
		}
	}

	this._validateMove = function(playerAction) {
		var targetPiece = playerAction.targetPiece
		var targetCase = playerAction.targetCase;

		var errorMessages = [];
		var validationStatus = true;

		if (! targetPiece.pieceType.mobile) {
			validationStatus = false;
			errorMessages.push(
				'La pièce sélectionnée ne se déplace pas');
		}
		// Si la pièce est enlisé en fonction de la marée
		if (this._isPieceBoggedDown(targetPiece)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce sélectionnée est bloquée à marée ' + partie.currentMaree.name);
		}
		// Si la pièce sélectionnée et la case ciblée ne sont pas adjacentes
		if (! this._arePieceAndCaseAdjacent(targetPiece, targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La case ciblée n\'est pas adjacente à la pièce sélectionnée');
		}
		// - On peut échouer une unité mais uniquement sur les cases 
		// qui varient en fonction de la marée
		// - Les véhicules terrestres ne peuvent pas aller sur les cases types MER
		// - Les véhicules maritimes ne peuvent pas aller sur les cases de type PLAINE et MONTAGNE
		// - Les gros tas ne peuvent pas aller sur les cases type MER et MONTAGNE
		if (! this._isPieceMovableOnCase(targetPiece, targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La piece sélectionnée ' + targetPiece.pieceType.name 
				+ ' ne peut pas aller sur une case de type ' + targetCase.caseType.name);
		}
		if (! this._isCaseFree(targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La case ciblée n\'est pas libre');
		}
		if (! this._isFreeFromEnemyFire(targetPiece)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce sélectionnée est à portée de tir de l\'ennemi');
		}
		if (! this._isFreeFromEnemyFire(targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La case ciblée est à portée de tir de l\'ennemi');
		}
		return { 
			success: validationStatus,
			errorMessages: errorMessages
		}
	}
	this._isPieceBoggedDown = function(piece) {
		var maree = partie.currentMaree;
		var casePiece = partie.getCasePiece(piece);
		var casePieceMaree = casePiece.getCaseTypeMaree(maree);
		if (piece.pieceType.modeDeplacement != casePieceMaree.modeDeplacement) {
			// console.log('Impossible de deplacer un ' + piece.pieceType.name + ' de type ' + piece.pieceType.modeDeplacement +  ' sur une case ' + casePieceMaree.name);
			return true;
		}
		if (piece.pieceType == PIECE_TYPE.BARGE) {
			var caseAvantBargeCoords = tools.getCaseCoordsInOrientation(casePiece, piece.orientation);
			var caseAvantBarge = partie.getCase(caseAvantBargeCoords.x, caseAvantBargeCoords.y);
			var caseAvantBargeMaree = caseAvantBarge.getCaseTypeMaree(maree);
			if (piece.pieceType.modeDeplacement != caseAvantBargeMaree.modeDeplacement) {
				// console.log('Impossible de deplacer un ' + piece.pieceType.name + ' de type ' + piece.pieceType.modeDeplacement +  ' sur une case ' + caseAvantBargeMaree.name);
				return true;
			}
		}
		return false;
	}
	this._arePieceAndCaseAdjacent = function(piece, targetCase) {
		if (tools.areCoordinatesAdjacent(piece.x, piece.y, targetCase.x, targetCase.y)) {
			return true;
		} else if (piece.pieceType == PIECE_TYPE.BARGE) {
			var caseArriereBarge = partie.getCasePiece(piece);
			var caseAvantBargeCoords = tools.getCaseCoordsInOrientation(caseArriereBarge, piece.orientation);
			if (tools.areCoordinatesAdjacent(caseAvantBargeCoords.x, caseAvantBargeCoords.y, targetCase.x, targetCase.y)) {
				return true;
			}
		}
		return false;
	}
	// - On peut échouer une unité mais uniquement sur les cases 
	// qui varient en fonction de la marée
	// - Les véhicules terrestres ne peuvent pas aller sur les cases types MER
	// - Les véhicules maritimes ne peuvent pas aller sur les cases de type PLAINE et MONTAGNE
	// - Les gros tas ne peuvent pas aller sur les cases type MER et MONTAGNE
	this._isPieceMovableOnCase = function(piece, targetCase) {
		var maree = partie.currentMaree;
		var targetCaseMaree = targetCase.getCaseTypeMaree(maree);
		if (piece.pieceType.modeDeplacement != targetCaseMaree.modeDeplacement) {
			// Exception : On peut obliger une unité à aller sur un endroit
			// qui la neutralise mais obligatoirement sur un type qui peut changer
			// selon la marée, donc on exclut toutes les cases non marecage ou recif
			if (targetCase.caseType != CASE_TYPE.MARECAGE
				&& targetCase.caseType != CASE_TYPE.RECIF) {
				return false;
			}
		}
		// TODO Implémenter la condition pour que le gros tas ne puisse pas monter sur une montagne
		return true;
	}
	this._isCaseFree = function(targetCase) {
		if (partie.getPieceIfAvailable(targetCase) == null) {
			return true;
		}
		console.log('La case (x: ' + targetCase.x + ', y: ' + targetCase.y + ') contient deja une piece');
		return false;
	}
	this._isFreeFromEnemyFire = function(pieceOrCase) {
		var player = partie.getPlayer();

		if (pieceOrCase instanceof Piece) {
			player = pieceOrCase.player;
		}

		if (partie.countEnemiesThatCanAttackInRange(pieceOrCase.x, pieceOrCase.y, player) < 2) {
			// Fo vérifier au cas ou ce n'est pas une barge, la case avant est concernée aussi
			if (pieceOrCase instanceof Piece && pieceOrCase.pieceType == PIECE_TYPE.BARGE) {
				var caseArriereBarge = partie.getCasePiece(pieceOrCase);
				var caseAvantBargeCoords = tools.getCaseCoordsInOrientation(caseArriereBarge, pieceOrCase.orientation);
				if (partie.countEnemiesThatCanAttackInRange(caseAvantBargeCoords.x, caseAvantBargeCoords.y, player) < 2) {
					return true;
				} else {
					console.log('L\'avant de la barge est sous le feu ennemi');
					return false;
				}
			} else {
				return true;
			}
		} else {
			// console.log('La case / piece en x: ' + pieceOrCase.x + ', y: ' + pieceOrCase.y + ' est sous le feu ennemi');
			return false;
		}
	}

	/****************************
	* Chargement / Déchargement *
	****************************/
	this._getTransportCapaciteRestante = function(pieceTransporter) {
		var capaciteRestante = pieceTransporter.pieceType.transportCapacite;

		if (pieceTransporter.getContenu() != null 
			&& pieceTransporter.getContenu().length > 0) {

			for (var piece in pieceTransporter.getContenu()) {
				capaciteRestante -= pieceTransporter.getContenu()[piece].pieceType.encombrement;
			}
		}
		return capaciteRestante;
	}
	this._canTransporterChargePiece = function(pieceTransporter, pieceACharger) {
		if (this._getTransportCapaciteRestante(pieceTransporter) < pieceACharger.pieceType.encombrement) {
			// console.log('Capacite de maximum de transport restante (' + this._getTransportCapaciteRestante(pieceTransporter) + ') inférieure à l\'encombrement de la piece (' + pieceACharger.pieceType.encombrement + ')');
			return false;
		}
		return true;
	}
	this._isPieceLoadable = function(pieceACharger) {
		var maree = partie.currentMaree;
		var casePiece = partie.getCasePiece(pieceACharger);
		var casePieceMaree = casePiece.getCaseTypeMaree(maree);
		if (pieceACharger.pieceType.modeDeplacement != casePieceMaree.modeDeplacement) {
			// console.log('Impossible de deplacer un ' + pieceACharger.pieceType.name + ' de type ' + pieceACharger.pieceType.modeDeplacement +  ' sur une case ' + casePieceMaree.name);
			return false;
		}
		return true;
	}
	this._isRemainingAmmoOnPiecesAttacking = function(piecesAttacking) {
		for (var i in piecesAttacking) {
			if (piecesAttacking[i].contenu == null
				|| piecesAttacking[i].contenu.length == 0) {
				return false;
			}
		}
		return true;
	}
}