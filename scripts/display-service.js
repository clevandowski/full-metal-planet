var DisplayService = function(partie) {
	var localContext = {
		playersContext: []
	}
	this.init = function() {
		this.clearError();
		var players = partie.getPlayers();
		for (var i in players) {
			localContext.playersContext.push({
				playerId: players[i].id,
				selectedPiece: null, 
				selectedPieceSoute: null
			});
		}
	}
	this.clearError = function() {
		this.error = {
			showErrorPopup: false,
			actionType: null,
			errorMessages: []
		}
	}
	this.getError = function() {
		return this.error;
	}
	this.setError = function(error) {
		this.error = error;
	}
	this.getSelectedPiece = function () {
		var playerLocalContext = _getPlayerLocalContext();
		return playerLocalContext.selectedPiece;
	}
	this.getSelectedPieceSoute = function () {
		var playerLocalContext = _getPlayerLocalContext();
		return playerLocalContext.selectedPieceSoute;
	}
	this.setSelectedPiece = function(piece) {
		var playerLocalContext = _getPlayerLocalContext();
		playerLocalContext.selectedPiece = piece;
	}
	this.setSelectedPieceSoute = function(piece) {
		var playerLocalContext = _getPlayerLocalContext();
		playerLocalContext.selectedPieceSoute = piece;
	}
	this.getCurrentPlayerName = function() {
		return partie.getPlayer().name;
	}
	this.getCurrentPlayerTourPoint = function() {
		return partie.getTourPoints();
	}
	this.showCurrentPlayerPointsEconomise = function() {
		return partie.getPlayer().pointsEconomise > 0;
	}
	this.getCurrentPlayerPointsEconomise = function() {
		return partie.getPlayer().pointsEconomise;
	}
	this.getCurrentMareeName = function() {
		return partie.getCurrentMaree().name;
	}
	this.getNextMareeName = function() {
		return partie.getNextMaree().name;
	}
	this.getContenuSelectedPiece = function () {
		if (this.getSelectedPiece() != null) {
			return this.getSelectedPiece().contenu;
		}
	}
	this.getPlateau = function() {
		return partie.plateau;
	}
	this.getCssPieceSoute = function(piece) {
		return 'soute-container piece ' 
			+ piece.pieceType.cssName
			+ this._cssSelectedPieceSoute(piece);
	}
	this.noActionPointAnymore = function() {
		return partie.getTourPoints() <= 0;
	}
	this.getCssCase = function(targetCase) {
		return 'hexagon-case '
			+ targetCase.getCaseTypeMaree(partie.getCurrentMaree()).cssName
			+ this._cssSelectedPiece(targetCase);
	}
	this.isPieceOnCase = function(targetCase) {
		return partie.getPieceIfAvailable(targetCase) != null;
	}
	this.getCssPiece = function(targetCase) {
		var piece = partie.getPieceIfAvailable(targetCase);

		if (piece == null) {
			return 'piece';
		} else {
			return 'piece ' 
			+ piece.pieceType.cssName + ' '
			+ piece.orientation.cssName;
		}
	}
	/*
	 * @???Service
	 * @dependsOn(@PartieService, getSelectedPiece, getPlayer, pieces)
	 * @dependsOn(@UtilService, centerPlateauOnCoordinates)
	 */
	this.centerPlateau = function() {
		if (this.getSelectedPiece() != null) {
			_centerPlateauOnCoordinates(this.getSelectedPiece().x, this.getSelectedPiece().y);
		} else {
			var player = partie.getPlayer();
			var barge = partie.getPieces().filter(
				function(piece) {
					return piece.playerId == player.id && piece.pieceType == PIECE_TYPE.BARGE
				}
			)
			if (barge.length >= 1) {
		 		_centerPlateauOnCoordinates(barge[0].x, barge[0].y);
			}
		}
	}
	this.exploseOnCase = function(targetCase) {
		// TODO Déplacer dans DisplayService
		targetCase.explose = true;
		// C'est pas elegant mais ça sert à attendre les 4s de l'animation de 
		// l'explosion qui disparait en CSS
		setTimeout(function() {
			console.log('Piece: ' + piece.pieceType.name);
		    targetCase.explose = false;
		}, 4000);
	}
	/*
	 * @CssService
	 * @dependsOn(@PartieService, getSelectedPiece)
	 */	
	// Obligé de déclarer dans this car on utilise des fonctions de this...
	// TODO A nettoyer
	this._cssSelectedPiece = function(targetCase) {
	 	if (this.getSelectedPiece() != null
	 		&& targetCase.x == this.getSelectedPiece().x
	 		&& targetCase.y == this.getSelectedPiece().y) {
 			return ' selectedPiece';
 		} else {
 			return '';
 		}
	 		// TODO Corriger la css pour que le résultat sur la barge ne soit pas
	 		// trop horrible
	 		// else if (this.getSelectedPiece().pieceType == PIECE_TYPE.BARGE) {
	 		// 	var caseBarge = this.getCasePiece(this.getSelectedPiece());
	 		// 	var caseAvantBargeCoords = 
	 		// 		this.getCaseCoordsInOrientation(caseBarge, this.getSelectedPiece().orientation);
				// if ((targetCase.x == caseAvantBargeCoords.x)
			 // 		&& (targetCase.y == caseAvantBargeCoords.y)) {
				//  	return 'selectedPiece';
				// }
	 		// }	
	}
	/*
	 * @CssService
	 * @dependsOn(@PartieService, getSelectedPiece)
	 */
	// Obligé de déclarer dans this car on utilise des fonctions de this...
	// TODO A nettoyer
	this._cssSelectedPieceSoute = function(piece) {
	 	if (this.getSelectedPieceSoute() == piece) {
 			return ' selectedPiece';
	 	} else {
	 		return '';
	 	}
	}

	/*
	 * @???Service
	 */
	var _centerPlateauOnCoordinates = function(x, y) {
		// C'est un peu à l'arrache mais ça permet d'eviter d'avoir a scroller pour trouver 
		// la derniere unite selectionnee
		$('#container').scrollLeft(x * 90 - 755);
		$('#container').scrollTop(y * 102 - 298);
	}

	var _getPlayerLocalContext = function() {
		var player = partie.getPlayer();
		return localContext.playersContext.filter(function(playerContext) {
			// console.log('playerContext: ' + JSON.stringify(playerContext) + ', this.id: ' + this.id);
			return playerContext.playerId == this.id;
		}, player)[0];
	}
}
