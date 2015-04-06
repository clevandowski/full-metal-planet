var EventListener = function(partie, referee, engine, tools, displayService) {
	/*
	 * TODO A finir pour le listener
	 */
	this.onClick = function(targetCase) {
		// console.log(JSON.stringify(partie.datas));
		if (displayService.getError().showErrorPopup) {
			displayService.clearError();
		}

		if (partie.tourPoints <= 0) {
			displayService.setError({
				actionType: null,
				errorMessages: [ 'Plus aucun point d\'action restant pour le joueur ' + partie.getPlayer().name ],
				showErrorPopup: true
			});
			return;
		}

		var playerActionDetected = this._detectPlayerAction(targetCase);

		if (playerActionDetected == null) {
			console.log('No action No cry...');
			return;
		}

		var actionReport = referee.validatePlayerAction(playerActionDetected);

		if (actionReport.success) {
			var partieHashcode = engine.applyPlayerAction(playerActionDetected);
			// Vérification
			// if (actionReport.partieHashcode != partieHashcode) {
			// 	throw 'Error on party checksum ! Reload the party !!!';
			// }
		} else {
			displayService.setError({
				actionType: playerActionDetected.actionType,
				errorMessages: actionReport.errorMessages,
				showErrorPopup: true
			});
		}
	}
	
	/*
	 * @ListenerService
	 */
	this.onClickSoute = function(piece) {
		console.log('Piece selectionnee dans la soute : ' + piece.pieceType.name);
		partie.setSelectedPieceSoute(piece);
	}

	this.finDuTour = function() {
		partie.setTourToNextPlayer();
		displayService.centerPlateau();
		displayService.clearError();
	}

	this._detectPlayerAction = function(targetCase) {
		var targetPiece = partie.getPieceIfAvailable(targetCase);
		var selectedPiece = partie.getSelectedPiece();
		var selectedPieceSoute = partie.getSelectedPieceSoute();

		// Si on cible une case vide
		if (targetPiece == null) {
			if (selectedPiece == null 
				&& selectedPieceSoute == null) {
				return null;
			} else {
				// Note : si selectedPieceSoute est != null c'est que selectedPiece est != null
				if (selectedPieceSoute != null) {
					return {
						actionType: PLAYER_ACTION_TYPE.UNLOAD,
						pieceADecharger: selectedPieceSoute,
						pieceTransporter: selectedPiece,
						targetCase: targetCase
					}
				} else if (selectedPiece != null) {
					return {
						actionType: PLAYER_ACTION_TYPE.MOVE,
						targetPiece: selectedPiece,
						targetCase: targetCase
					}
				}
			}
		} else {
			if (targetPiece.player != partie.getPlayer()
				&& ! partie.isFreeFromEnemyFire(targetPiece)) {
				// Attaque
				return {
					actionType: PLAYER_ACTION_TYPE.ATTACK,
					targetPiece: targetPiece
				}
			} else if (targetPiece.pieceType.transporter
				&& selectedPiece != null
				&& selectedPiece != targetPiece
				&& this._areTransporterAndPieceToLoadAdjacent(targetPiece, selectedPiece)) {
				// Chargement
				return {
					actionType: PLAYER_ACTION_TYPE.LOAD,
					pieceACharger: selectedPiece,
					pieceTransporter: targetPiece
				}
			} else {
				/*
				 * Selection, après la vérification d'une tentative d'attaque
				 * (S'il ya une pièce amie sur la case cliquée et qu'aucune pièce n'est sélectionnée)
				 */
				return {
					actionType: PLAYER_ACTION_TYPE.SELECT,
					targetPiece: targetPiece
				}
			}
		}
	}

	this._areTransporterAndPieceToLoadAdjacent = function(pieceTransporter, toUnloadPiece) {
		if (tools.areCoordinatesAdjacent(pieceTransporter.x, pieceTransporter.y, toUnloadPiece.x, toUnloadPiece.y)) {
			return true;
		} else if (pieceTransporter.pieceType == PIECE_TYPE.BARGE) {
			var caseArriereBarge = partie.getCasePiece(pieceTransporter);
			var caseAvantBargeCoords = tools.getCaseCoordsInOrientation(caseArriereBarge, pieceTransporter.orientation);
			if (tools.areCoordinatesAdjacent(caseAvantBargeCoords.x, caseAvantBargeCoords.y, toUnloadPiece.x, toUnloadPiece.y)) {
				return true;
			}
		}
		return false;
	}
}