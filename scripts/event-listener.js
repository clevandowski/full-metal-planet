var EventListener = function(partie) {

	/*
	 * TODO A finir pour le listener
	 */
	this.onClick = function(targetCase) {
		if (partie.tourPoints <= 0) {
			throw 'Plus aucun point d\'action restants pour le joueur ' + partie.getPlayer().name;
		}

		var playerActionDetected = this._detectPlayerAction(targetCase);
		var validation = this._validatePlayerAction(playerActionDetected);

		if (validation.result) {
			playerActionDetected.execute();
		} else {
			throw validation.errorMessage;
		}
	}

	this.onFinDuTour = function() {
		partie.setTourToNextPlayer(false);
	}

	this._detectPlayerAction = function(targetCase) {
		var selectedPiece = partie.getSelectedPiece();
		var targetPiece = partie.getPieceIfAvailable(targetCase);

		if (selectedPiece == null 
			&& targetPiece != null) {
			return {
				actionType: PLAYER_ACTION_TYPE.SELECT,
				targetPiece: targetPiece,
				execute: partie.setSelectedPiece
			}	
		}
	}
	this._validatePlayerAction = function(playerAction) {
		switch(playerAction.actionType) {
			case PLAYER_ACTION_TYPE.SELECT:
			return {
				result: true
			};
		}
	}
}