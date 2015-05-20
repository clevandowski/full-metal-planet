var EventListener = function(fmpConstants, refereeRuntimeMode, partie, referee, engine, tools, displayService) {
	
	this.onClick = function(targetCase) {
		if (displayService.getError().showErrorPopup) {
			displayService.clearError();
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
		referee.validatePlayerAction(playerActionDetected, _callbackValidatePlayerAction);
	}
	var _callbackValidatePlayerAction = function(playerActionDetected, actionReport) {
		if (actionReport.success) {
			var partieHashcode = engine.applyPlayerAction(playerActionDetected, actionReport);
			// Vérification cohérence client/serveur
			// Sur retour partie remote, on vérifie que les 2 parties sont synchro
			// En mode local ou server, pas besoin de vérifier.
			if (refereeRuntimeMode == fmpConstants.REFEREE_RUNTIME_MODE.REMOTE) {
				console.log('local party hashcode: ' + partieHashcode)
				if (actionReport.hashcode == partieHashcode) {
					console.log('Server synchro !');
				} else {
					displayService.setError({
						actionType: playerActionDetected.actionType,
						errorMessages: [ 'Partie désynchronisée avec le serveur !' ],
						showErrorPopup: true
					});
					console.log('Partie désynchronisée avec le serveur !');
				}
			}
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
			var partieHashcode = engine.applyPlayerAction(playerAction, actionReport);
			displayService.clearError();

			if (refereeRuntimeMode == fmpConstants.REFEREE_RUNTIME_MODE.REMOTE) {
				console.log('local party hashcode: ' + partieHashcode)
				if (actionReport.hashcode == partieHashcode) {
					console.log('Server synchro !');
				} else {
					displayService.setError({
						actionType: playerAction.actionType,
						errorMessages: [ 'Partie désynchronisée avec le serveur !', 'Appuyer sur F5 pour réinitialiser la partie' ],
						showErrorPopup: true
					});
				}
			}
			displayService.centerPlateau();
			displayService.setError({
				errorType: 'info',
				showErrorPopup: true,
				actionType: null,
				errorMessages: [ 'Sélectionnez une pièce du joueur ' + partie.getPlayer().name ]
			});
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
		// Attention l'avant de la barge peut etre considéré case vide
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
					// Cas à la con : si la barge est sélectionnée et que le joueur
					// clique sur l'avant de la barge.
					if (selectedPiece.pieceType.value == fmpConstants.PIECE_TYPE.BARGE.value) {
						var coordsCaseAvantBarge = tools.getCoordsCaseAvantBarge(selectedPiece);
						if (coordsCaseAvantBarge.x == targetCase.x
							&& coordsCaseAvantBarge.y == targetCase.y ) {
							console.log('Clic détecté sur l\'avant de la barge.');
							return null;
						}
					}
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
				&& selectedPiece.pieceType.mobile
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
