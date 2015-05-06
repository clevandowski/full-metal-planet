var Referee = function(fmpConstants, partie, tools) {
	this.validatePlayerAction = function(playerAction, callback) {
		var actionReport;
		switch (playerAction.actionType.value) {
			case fmpConstants.PLAYER_ACTION_TYPE.MOVE.value:
				actionReport = _validateMove(playerAction);
				break;
			case fmpConstants.PLAYER_ACTION_TYPE.LOAD.value:
				actionReport = _validateLoad(playerAction);
				break;
			case fmpConstants.PLAYER_ACTION_TYPE.UNLOAD.value:
				actionReport = _validateUnload(playerAction);
				break;
			case fmpConstants.PLAYER_ACTION_TYPE.ATTACK.value:
				actionReport = _validateAttack(playerAction);
				break;
			case fmpConstants.PLAYER_ACTION_TYPE.END_OF_TURN.value:
				actionReport =  { success: true };
				break;
			default:
				console.log('Unknow playerAction: ' + JSON.stringify(playerAction));
				actionReport = {
					success: false, 
					errorMessages: ['Erreur lors de l\'appel au serveur', 'Regardez les logs dans la console']
				}
				break;
		}
		if (callback != null) {
			callback(playerAction, actionReport);
		}
		return actionReport;
	}
	var _validateLoad = function(playerAction) {
		var pieceTransporter = partie.getPieceById(playerAction.pieceTransporterId);
		var pieceACharger = partie.getPieceById(playerAction.pieceAChargerId);

		var errorMessages = [];
		var validationStatus = true;

		if (partie.getTourPoints() == 0) {
			validationStatus = false;
			errorMessages.push(
				'Pas de réserve de point suffisant pour attaquer');
		}
		if (! _canTransporterChargePiece(pieceTransporter, pieceACharger)) {
			validationStatus = false;
			errorMessages.push(
				'Le transporteur n\'a plus suffisamment de place pour charger un ' + pieceACharger.pieceType.name);
		}
		// Si la pièce est enlisée en fonction de la marée
		if (! _isPieceLoadable(pieceACharger)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce à charger est bloquée à marée ' + partie.getCurrentMaree().name);
		}
		if (! partie.isFreeFromEnemyFire(pieceTransporter)) {
			validationStatus = false;
			errorMessages.push(
				'Le transporteur est à portée de tir ennemi');
		}
		if (! partie.isFreeFromEnemyFire(pieceACharger)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce à charger est à portée de tir ennemi');
		}
		return {
			success: validationStatus,
			errorMessages: errorMessages
		}
	}
	var _validateUnload = function(playerAction) {
		var pieceTransporter = partie.getPieceById(playerAction.pieceTransporterId);
		var pieceADecharger = partie.getPieceById(playerAction.pieceADechargerId);
		var targetCase = playerAction.targetCase;

		var errorMessages = [];
		var validationStatus = true;

		if (partie.getTourPoints() == 0) {
			validationStatus = false;
			errorMessages.push(
				'Pas de réserve de point suffisant pour attaquer');
		}
		if (! tools.areAdjacent(pieceTransporter, targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'Il faut décharger sur une case adjacente au transporteur');
		}
		if (targetCase.caseType.value == fmpConstants.CASE_TYPE.MER.value) {
			validationStatus = false;
			errorMessages.push(
				'Le déchargement en mer est interdit');			
		}
		if (! partie.isFreeFromEnemyFire(pieceTransporter)) {
			validationStatus = false;
			errorMessages.push(
				'Le transporteur est à portée de tir ennemi');
		}
		if (! partie.isFreeFromEnemyFire(targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La case ciblée pour décharger est à portée de tir ennemi');
		}
		return { 
			success: validationStatus,
			errorMessages: errorMessages
		}
	}
	var _validateAttack = function(playerAction) {
		var targetPiece = partie.getPieceById(playerAction.targetPieceId);
		var piecesIdAttacking = 
			partie.getEnemiesThatCanAttackInRange(targetPiece.x, targetPiece.y, targetPiece.playerId);

		var errorMessages = [];
		var validationStatus = true;

		if (partie.getTourPoints() < 2) {
			validationStatus = false;
			errorMessages.push(
				'Pas de réserve de point suffisant pour attaquer');
		}
		if (piecesIdAttacking.length > 2) {
			console.log('TODO: Pouvoir choisir les attaquants');
		}
		if (! _isRemainingAmmoOnPiecesIdAttacking(piecesIdAttacking)) {
			validationStatus = false;
			errorMessages.push(
				'Pas assez de munitions pour attaquer');
		}

		return {
			success: validationStatus,
			attackCoords: { x: targetPiece.x, y: targetPiece.y }, 
			errorMessages: errorMessages
		}
	}
	var _validateMove = function(playerAction) {
		var targetPiece = partie.getPieceById(playerAction.targetPieceId);
		var targetCase = playerAction.targetCase;

		var errorMessages = [];
		var validationStatus = true;

		if (partie.getTourPoints() == 0) {
			validationStatus = false;
			errorMessages.push(
				'Pas de réserve de point suffisant pour attaquer');
		}
		if (! targetPiece.pieceType.mobile) {
			validationStatus = false;
			errorMessages.push(
				'La pièce sélectionnée ne se déplace pas');
		}
		// Si la pièce est enlisée en fonction de la marée
		if (_isPieceBoggedDown(targetPiece)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce sélectionnée est bloquée à marée ' + partie.getCurrentMaree().name);
		}
		// Si la pièce sélectionnée et la case ciblée ne sont pas adjacentes
		if (! tools.areAdjacent(targetPiece, targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'On ne peut se déplacer que d\'une case à la fois');
		}
		// - On peut échouer une unité mais uniquement sur les cases 
		// qui varient en fonction de la marée
		// - Les véhicules terrestres ne peuvent pas aller sur les cases types MER
		// - Les véhicules maritimes ne peuvent pas aller sur les cases de type PLAINE et MONTAGNE
		// - Les gros tas ne peuvent pas aller sur les cases type MER et MONTAGNE
		if (! _isPieceMovableOnCase(targetPiece, targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La piece sélectionnée ' + targetPiece.pieceType.name 
				+ ' ne peut pas aller sur une case de type ' + targetCase.caseType.name);
		}
		if (! _isCaseFree(targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La case ciblée n\'est pas libre');
		}
		if (! partie.isFreeFromEnemyFire(targetPiece)) {
			validationStatus = false;
			errorMessages.push(
				'La pièce sélectionnée est à portée de tir de l\'ennemi');
		}
		if (! partie.isFreeFromEnemyFire(targetCase)) {
			validationStatus = false;
			errorMessages.push(
				'La case ciblée est à portée de tir de l\'ennemi');
		}
		return { 
			success: validationStatus,
			errorMessages: errorMessages
		}
	}
	var _isPieceBoggedDown = function(piece) {
		var maree = partie.getCurrentMaree();
		var casePiece = partie.getCasePieceId(piece.id);
		var casePieceMaree = tools.getCaseTypeMaree(casePiece, maree);
		if (piece.pieceType.modeDeplacement != casePieceMaree.modeDeplacement) {
			// console.log('Impossible de deplacer un ' + piece.pieceType.name + ' de type ' + piece.pieceType.modeDeplacement +  ' sur une case ' + casePieceMaree.name);
			return true;
		}
		if (piece.pieceType.value == fmpConstants.PIECE_TYPE.BARGE.value) {
			var caseAvantBargeCoords = tools.getCoordsCaseAvantBarge(piece);
			var caseAvantBarge = partie.getCase(caseAvantBargeCoords.x, caseAvantBargeCoords.y);
			var caseAvantBargeMaree = tools.getCaseTypeMaree(caseAvantBarge, maree);
			if (piece.pieceType.modeDeplacement != caseAvantBargeMaree.modeDeplacement) {
				// console.log('Impossible de deplacer un ' + piece.pieceType.name + ' de type ' + piece.pieceType.modeDeplacement +  ' sur une case ' + caseAvantBargeMaree.name);
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
	var _isPieceMovableOnCase = function(piece, targetCase) {
		var maree = partie.getCurrentMaree();
		var targetCaseMaree = tools.getCaseTypeMaree(targetCase, maree);
		if (piece.pieceType.modeDeplacement != targetCaseMaree.modeDeplacement) {
			// Exception : On peut obliger une unité à aller sur un endroit
			// qui la neutralise mais obligatoirement sur un type qui peut changer
			// selon la marée, donc on exclut toutes les cases non marecage ou recif
			if (targetCase.caseType.value != fmpConstants.CASE_TYPE.MARECAGE.value
				&& targetCase.caseType.value != fmpConstants.CASE_TYPE.RECIF.value) {
				return false;
			}
		}
		// TODO Implémenter la condition pour que le gros tas ne puisse pas monter sur une montagne
		return true;
	}
	var _isCaseFree = function(targetCase) {
		if (partie.getPieceIfAvailable(targetCase) == null) {
			return true;
		}
		console.log('La case (x: ' + targetCase.x + ', y: ' + targetCase.y + ') contient deja une piece');
		return false;
	}

	/****************************
	* Chargement / Déchargement *
	****************************/
	var _getTransportCapaciteRestante = function(pieceTransporter) {
		var capaciteRestante = pieceTransporter.pieceType.transportCapacite;
		var contenu = pieceTransporter.contenu;

		if (contenu != null 
			&& contenu.length > 0) {

			contenu.forEach(function(pieceId) {
				var piece = partie.getPieceById(pieceId)
				capaciteRestante -= piece.pieceType.encombrement;
			});
		}
		return capaciteRestante;
	}
	var _canTransporterChargePiece = function(pieceTransporter, pieceACharger) {
		if (_getTransportCapaciteRestante(pieceTransporter) < pieceACharger.pieceType.encombrement) {
			// console.log('Capacite de maximum de transport restante (' + _getTransportCapaciteRestante(pieceTransporter) + ') inférieure à l\'encombrement de la piece (' + pieceACharger.pieceType.encombrement + ')');
			return false;
		}
		return true;
	}
	var _isPieceLoadable = function(pieceACharger) {
		var maree = partie.getCurrentMaree();
		var casePiece = partie.getCasePieceId(pieceACharger.id);
		var casePieceMaree = tools.getCaseTypeMaree(casePiece, maree);
		if (pieceACharger.pieceType.modeDeplacement != casePieceMaree.modeDeplacement) {
			// console.log('Impossible de deplacer un ' + pieceACharger.pieceType.name + ' de type ' + pieceACharger.pieceType.modeDeplacement +  ' sur une case ' + casePieceMaree.name);
			return false;
		}
		return true;
	}
	// Là c'est moyen car si ya plus de 2 attaquants la règles est fausse
	var _isRemainingAmmoOnPiecesIdAttacking = function(piecesIdAttacking) {
		for (var i in piecesIdAttacking) {
			if (partie.getPieceById(piecesIdAttacking[i]).nbAmmos <= 0) {
				return false;
			}
		}
		return true;
	}
}

// node.js ?
if (typeof module !== 'undefined' && module.exports) {
	module.exports.Referee = Referee;
}