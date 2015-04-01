var DisplayService = function(partie) {
	this.getCurrentPlayerName = function() {
		return partie.getPlayer().name;
	}
	this.getCurrentPlayerTourPoint = function() {
		return partie.tourPoints;
	}
	this.showCurrentPlayerPointsEconomise = function() {
		return partie.getPlayer().pointsEconomise > 0;
	}
	this.getCurrentPlayerPointsEconomise = function() {
		return partie.getPlayer().pointsEconomise;
	}
	this.getCurrentMareeName = function() {
		return partie.currentMaree.name;
	}
	this.getNextMareeName = function() {
		return partie.nextMaree.name;
	}
	this.getContenuSelectedPiece = function () {
		if (partie.getPlayer().selectedPiece) {
			return partie.getPlayer().selectedPiece.contenu;
		}
	}
	this.getPlateau = function() {
		return partie.plateau;
	}
	this.getCssPieceSoute = function(piece) {
		return 'soute-container piece ' 
			+ piece.pieceType.cssName + ' ' 
			+ this.cssSelectedPieceSoute(piece);
	}


	this.noActionPointAnymore = function() {
		return partie.tourPoints <= 0;
	}

	this.getCssCase = function(targetCase) {
		return 'hexagon-case '
			+ targetCase.getCaseTypeMaree(partie.currentMaree).cssName
			+ this.cssSelectedPiece(targetCase);
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
	 * @CssService
	 * @dependsOn(@PartieService, getSelectedPiece)
	 */	
	this.cssSelectedPiece = function(targetCase) {
	 	if (partie.getSelectedPiece() != null
	 		&& targetCase.x == partie.getSelectedPiece().x
	 		&& targetCase.y == partie.getSelectedPiece().y) {
 			return ' selectedPiece';
 		} else {
 			return '';
 		}
	 		// TODO Corriger la css pour que le résultat sur la barge ne soit pas
	 		// trop horrible
	 		// else if (partie.getSelectedPiece().pieceType == PIECE_TYPE.BARGE) {
	 		// 	var caseBarge = this.getCasePiece(partie.getSelectedPiece());
	 		// 	var caseAvantBargeCoords = 
	 		// 		this.getCaseCoordsInOrientation(caseBarge, partie.getSelectedPiece().orientation);
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
	this.cssSelectedPieceSoute = function(piece) {
	 	if (this.getSelectedPieceSoute() == piece) {
 			return 'selectedPiece';
	 	} else {
	 		return '';
	 	}
	}

	/*
	 * @???Service
	 */
	this.centerPlateauOnCoordinates = function(x, y) {
		// C'est un peu à l'arrache mais ça permet d'eviter d'avoir a scroller pour trouver 
		// la derniere unite selectionnee
		$('#container').scrollLeft(x * 90 - 755);
		$('#container').scrollTop(y * 102 - 298);
	}
	/*
	 * @???Service
	 * @dependsOn(@PartieService, getSelectedPiece, getPlayer, pieces)
	 * @dependsOn(@UtilService, centerPlateauOnCoordinates)
	 */
	this.centerPlateau = function() {
		if (partie.getSelectedPiece() != null) {
			this.centerPlateauOnCoordinates(partie.getSelectedPiece().x, partie.getSelectedPiece().y);
		} else {
			var player = partie.getPlayer();
			var barge = partie.pieces.filter(
				function(piece) { 
					return piece.player == player && piece.pieceType == PIECE_TYPE.BARGE
				}
			)
			if (barge.length >= 1) {
		 		this.centerPlateauOnCoordinates(barge[0].x, barge[0].y);
			}
		}
	}

	/*
	 * @PartieService
	 */
	this.getSelectedPieceSoute = function () {
		return partie.getPlayer().selectedPieceSoute;
	}
}
