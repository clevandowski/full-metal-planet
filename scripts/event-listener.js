var EventListener = function(partie, referee, engine, tools, displayService) {
	
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
		var playerAction = { actionType: PLAYER_ACTION_TYPE.END_OF_TURN	};
		var actionReport = referee.validatePlayerAction(playerAction);
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
			if (targetPiece.playerId != partie.getPlayer().id
				&& ! partie.isFreeFromEnemyFire(targetPiece)) {
				// Attaque
				return {
					actionType: PLAYER_ACTION_TYPE.ATTACK,
					targetPiece: targetPiece
				}
			} else if (targetPiece.pieceType.transporter
				&& selectedPiece != null
				&& selectedPiece != targetPiece
				&& tools.areAdjacent(targetPiece, selectedPiece)) {
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
}