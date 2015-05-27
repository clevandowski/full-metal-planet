var DisplayService = function(fmpConstants, partie, tools) {
	var localContext = {
		playersContext: []
	}
	var plateau;

	this.clearError = function() {
		this.error = {
			showErrorPopup: false,
			actionType: null,
			errorMessages: []
		}
	}
	this.init = function() {
		this.error = {
			errorType: 'info',
			showErrorPopup: true,
			actionType: null,
			errorMessages: [ 'Sélectionnez une pièce du joueur ' + partie.getPlayer().name ]
		};
		var players = partie.getPlayers();
		for (var i in players) {
			localContext.playersContext.push({
				playerId: players[i].id,
				selectedPieceId: -1, 
				selectedPieceSouteId: -1
			});
		}
		plateau = partie.getPlateau();
	}
	this.init();
	
	this.getError = function() {
		return this.error;
	}
	this.setError = function(error) {
		this.error = error;
	}
	this.getErrorTitre = function() {
		if (this.error.showErrorPopup) {
			if (this.error.errorType == 'info') {
				return 'INFORMATION';
			} else {
				return 'ACTION ' + this.error.actionType.name.toUpperCase() + ' IMPOSSIBLE';
			}
		}
	}
	this.getSelectedPieceId = function () {
		var playerLocalContext = _getPlayerLocalContext();
		return playerLocalContext.selectedPieceId;
	}
	this.getSelectedPieceIdSoute = function () {
		var playerLocalContext = _getPlayerLocalContext();
		return playerLocalContext.selectedPieceIdSoute;
	}
	this.setSelectedPieceId = function(pieceId) {
		var playerLocalContext = _getPlayerLocalContext();
		playerLocalContext.selectedPieceId = pieceId;
	}
	this.setSelectedPieceIdSoute = function(pieceId) {
		var playerLocalContext = _getPlayerLocalContext();
		playerLocalContext.selectedPieceIdSoute = pieceId;
	}
	this.getCurrentPlayerName = function() {
		return partie.getPlayer().name + ' (' + partie.getPlayer().color + ')';
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
	this.getContenuSoute = function () {
		var selectedPiece = partie.getPieceById(this.getSelectedPieceId());
		if (selectedPiece != null) {
			if (selectedPiece.pieceType.transporter) {
				// Si une tourelle est sélectionnée, on affiche le contenu de
				// de la pièce du centre de l'aéronef
				if (selectedPiece.pieceType.value == fmpConstants.PIECE_TYPE.AERONEF_TURRET.value
					|| selectedPiece.pieceType.value == fmpConstants.PIECE_TYPE.AERONEF_TURRET_DESTROYED.value) {
					selectedPiece = partie.getAeronefCore();
				}
				return selectedPiece.contenu;
			} else if (selectedPiece.pieceType.destroyer) {
				// On s'en fout c une copie locale
				selectedPiece.contenu = [];
				for (var i = 0; i < selectedPiece.nbAmmos; i++) {
					selectedPiece.contenu.push(-(1 + i));
				}
				return selectedPiece.contenu;
			}
		}
	}
	this.getPlateau = function() {
		return plateau;
	}
	var _getCase = function(x, y) {
		return plateau[y][x];
	}
	this.getCssPieceSoute = function(pieceId) {
		var piece;
		// console.log('Piece soute : ' + pieceId);
		if (pieceId >= 0) {
			piece = partie.getPieceById(pieceId);
		} else {
			// Munition
			piece = { id: -1, pieceType: fmpConstants.PIECE_TYPE.MUNITION };
		}
		// console.log('pieceId: ' + JSON.stringify(pieceId));
		// var piece = _getPieceById(pieceId);
		return 'case-soute piece ' 
			+ piece.pieceType.cssName
			+ this._cssSelectedPieceSoute(pieceId);
	}
	this.noActionPointAnymore = function() {
		return partie.getTourPoints() <= 0;
	}
	this.getCssCase = function(targetCase) {
		// return 'hexagon-case '
		// 	+ targetCase.getCaseTypeMaree(partie.getCurrentMaree()).cssName
		// 	+ this._cssSelectedPiece(targetCase);
		return 'hexagon-case '
			+ tools.getCaseTypeMaree(targetCase, partie.getCurrentMaree()).cssName
			+ this._cssSelectedPiece(targetCase);
	}
	this.isPieceOnCase = function(targetCase) {
		return partie.getPieceOnCoord(targetCase) != null;
	}
	this.getCssPiece = function(targetCase) {
		var piece = partie.getPieceOnCoord(targetCase);

		if (piece == null) {
			return 'piece';
		} else {
			return 'piece ' 
			+ piece.pieceType.cssName + ' '
			+ piece.orientation.cssName;
		}
	}
	this.getCssPlayer = function(targetCase) {
		var piece = partie.getPieceOnCoord(targetCase);
		// On affiche pas le marqueur du player sur les tourelles de l'aeronef
		if (piece != null
			&& piece.pieceType.value != fmpConstants.PIECE_TYPE.AERONEF_TURRET.value
			&& piece.pieceType.value != fmpConstants.PIECE_TYPE.AERONEF_TURRET_DESTROYED.value) {
			var playerColor = partie.getPlayerById(piece.playerId).color;
			return 'player-' + playerColor;
		} else {
			return '';
		}
	}
	/*
	 * @???Service
	 * @dependsOn(@PartieService, getSelectedPiece, getPlayer, pieces)
	 * @dependsOn(@UtilService, centerPlateauOnCoordinates)
	 */
	this.centerPlateau = function() {
		var selectedPiece = partie.getPieceById(this.getSelectedPieceId());
		if (selectedPiece != null) {
			_centerPlateauOnCoordinates(selectedPiece.x, selectedPiece.y);
		} else {
			var player = partie.getPlayer();
			var barge = partie.getPieces().filter(function(piece) {
				return piece.playerId == player.id 
					&& piece.pieceType.value == fmpConstants.PIECE_TYPE.BARGE.value;
			});
			if (barge.length >= 1) {
		 		_centerPlateauOnCoordinates(barge[0].x, barge[0].y);
			}
		}
	}
	this.exploseOnCase = function(coords) {
		var targetCase = _getCase(coords.x, coords.y);
		targetCase.explose = true;
		// C'est pas elegant mais ça sert à attendre les 4s de l'animation de 
		// l'explosion qui disparait en CSS
		setTimeout(function() {
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
		var selectedPiece = partie.getPieceById(this.getSelectedPieceId());
	 	if (selectedPiece != null
	 		&& targetCase.x == selectedPiece.x
	 		&& targetCase.y == selectedPiece.y) {
 			return ' selectedPiece';
		}
 		return '';
 	}
	/*
	 * @CssService
	 * @dependsOn(@PartieService, getSelectedPiece)
	 */
	// Obligé de déclarer dans this car on utilise des fonctions de this...
	// TODO A nettoyer
	this._cssSelectedPieceSoute = function(pieceId) {
		// Si c'est une piece déchargeable (pas comme les munitions)
		if (pieceId >= 0) {
			if (this.getSelectedPieceIdSoute() == pieceId) {
	 			return ' selectedPiece';
			}
		}
		return '';
	}

	/*
	 * @???Service
	 */
	var _centerPlateauOnCoordinates = function(x, y) {
		// C'est un peu à l'arrache mais ça permet d'eviter d'avoir a scroller pour trouver 
		// la derniere unite selectionnee
		// TODO A injecter ?
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

	var _getPieceById = function(pieceId) {
		return partie.getPieceById(pieceId);
	}
}
