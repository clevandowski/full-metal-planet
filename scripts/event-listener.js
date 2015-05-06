var EventListener = function(fmpConstants, partie, referee, engine, tools, displayService) {
	
	// this.init()

	/*
	 * TODO A finir pour le listener
	 */
	this.onClick = function(targetCase) {
		if (displayService.getError().showErrorPopup) {
			displayService.clearError();
		}
		if (partie.getTourPoints() <= 0) {
			displayService.setError({
				actionType: null,
				errorMessages: [ 'Plus aucun point d\'action restant pour le joueur ' + partie.getPlayer().name ],
				showErrorPopup: true
			});
			return;
		}
		var playerActionDetected = _detectPlayerAction(targetCase);
		if (playerActionDetected == null) {
			console.log('No action No cry...');
			return;
		}
		
		// Actions locales, pas besoin de partager
		if (playerActionDetected.actionType.value == fmpConstants.PLAYER_ACTION_TYPE.SELECT.value) {
			var localActionReport = _validateSelect(playerActionDetected);
			if (localActionReport.success) {
				// Désélection si on sélectionne la pièce sélectionnée
				if (displayService.getSelectedPieceId() == playerActionDetected.targetPieceId) {
					displayService.setSelectedPieceId(-1);
				} else {
					displayService.setSelectedPieceId(playerActionDetected.targetPieceId);
				}
				displayService.setSelectedPieceIdSoute(-1);
			} else {
				displayService.setError({
					actionType: playerActionDetected.actionType,
					errorMessages: localActionReport.errorMessages,
					showErrorPopup: true
				});				
			}
			return;
		}

		// Actions globales
		referee.validatePlayerAction(playerActionDetected, callbackValidatePlayerAction);
	}

	var callbackValidatePlayerAction = function(playerActionDetected, actionReport) {
		if (actionReport.success) {
			var partieHashcode = engine.applyPlayerAction(playerActionDetected);
			// Vérification
			// if (actionReport.partieHashcode != partieHashcode) {
			// 	throw 'Error on party checksum ! Reload the party !!!';
			// }
			if (playerActionDetected.actionType.value == fmpConstants.PLAYER_ACTION_TYPE.MOVE.value) {
				displayService.setSelectedPieceId(playerActionDetected.targetPieceId);
				displayService.setSelectedPieceIdSoute(-1);
			}
			if (playerActionDetected.actionType.value == fmpConstants.PLAYER_ACTION_TYPE.LOAD.value) {
				displayService.setSelectedPieceId(playerActionDetected.pieceTransporterId);
				displayService.setSelectedPieceIdSoute(-1);
			}
			if (playerActionDetected.actionType.value == fmpConstants.PLAYER_ACTION_TYPE.UNLOAD.value) {
				displayService.setSelectedPieceIdSoute(-1);
			}
			if (playerActionDetected.actionType.value == fmpConstants.PLAYER_ACTION_TYPE.ATTACK.value) {
				displayService.exploseOnCase(actionReport.attackCoords);
			}
			// TODO sur PLAYER_ACTION_TYPE.ATTACK, déselectionner la piece qui vient 
			// d'être détruite.
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
	this.onClickSoute = function(pieceId) {
		if (pieceId >= 0) {
			console.log('Piece selectionnee dans la soute : ' + pieceId);
			displayService.setSelectedPieceIdSoute(pieceId);
		}
	}

	this.finDuTour = function() {
		var playerActionDetected = { actionType: fmpConstants.PLAYER_ACTION_TYPE.END_OF_TURN };
		var actionReport = referee.validatePlayerAction(playerActionDetected, callbackValidateFinDuTour);
	}
	var callbackValidateFinDuTour = function(playerAction, actionReport) {
		if (actionReport.success) {
			var partieHashcode = engine.applyPlayerAction(playerAction);
			displayService.centerPlateau();
			displayService.clearError();
		} else {
			displayService.setError({
				actionType: playerAction.actionType,
				errorMessages: actionReport.errorMessages,
				showErrorPopup: true
			});
		}
	}

	var _detectPlayerAction = function(targetCase) {
		var targetPiece = partie.getPieceIfAvailable(targetCase);
		var selectedPiece = partie.getPieceById(displayService.getSelectedPieceId());
		var selectedPieceSoute = partie.getPieceById(displayService.getSelectedPieceIdSoute());

		// Si on cible une case vide
		if (targetPiece == null) {
			if (selectedPiece == null
				&& selectedPieceSoute == null) {
				return null;
			} else {
				// Note : si selectedPieceSoute est != null c'est que selectedPiece est != null
				if (selectedPieceSoute != null) {
					return {
						actionType: fmpConstants.PLAYER_ACTION_TYPE.UNLOAD,
						pieceADechargerId: selectedPieceSoute.id,
						pieceTransporterId: selectedPiece.id,
						targetCase: targetCase
					}
				} else if (selectedPiece != null) {
					return {
						actionType: fmpConstants.PLAYER_ACTION_TYPE.MOVE,
						targetPieceId: selectedPiece.id,
						targetCase: targetCase
					}
				}
			}
		} else {
			if (targetPiece.playerId != partie.getPlayer().id
				&& ! partie.isFreeFromEnemyFire(targetPiece)
				&& window.confirm('Attaquer l\'unité ?')) {
				// Attaque
				return {
					actionType: fmpConstants.PLAYER_ACTION_TYPE.ATTACK,
					targetPieceId: targetPiece.id
				}
			} else if (targetPiece.pieceType.transporter
				&& selectedPiece != null
				&& selectedPiece.id != targetPiece.id
				&& tools.areAdjacent(targetPiece, selectedPiece)) {
				// Chargement
				return {
					actionType: fmpConstants.PLAYER_ACTION_TYPE.LOAD,
					pieceAChargerId: selectedPiece.id,
					pieceTransporterId: targetPiece.id
				}
			} else {
				/*
				 * Selection, après la vérification d'une tentative d'attaque
				 * (S'il ya une pièce amie sur la case cliquée et qu'aucune pièce n'est sélectionnée)
				 */
				return {
					actionType: fmpConstants.PLAYER_ACTION_TYPE.SELECT,
					targetPieceId: targetPiece.id
				}
			}
		}
	}
	var _validateSelect = function(playerAction) {
		var targetPieceId = playerAction.targetPieceId;
		var errorMessages = [];
		var validationStatus = true;

		if (! partie.isPieceOwnedByCurrentPlayer(targetPieceId)) {
		// if (targetPiece.playerId != partie.getPlayer().id) {
			validationStatus = false;
			errorMessages.push(
				'Cette pièce ne vous appartient pas');
		}
		return { 
			success: validationStatus,
			errorMessages: errorMessages
		}
	}
}
