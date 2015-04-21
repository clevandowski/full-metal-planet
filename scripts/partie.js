var Partie = function(plateau, tools) {
	var refereeRuntimeMode;
	// console.log('window.location:' + window.location.protocol);
	if (window.location.protocol == 'file:') {
		refereeRuntimeMode = REFEREE_RUNTIME_MODE.LOCAL;
	} else {
		refereeRuntimeMode = REFEREE_RUNTIME_MODE.REMOTE;
	}
	// var refereeRuntimeMode = REFEREE_RUNTIME_MODE.REMOTE;
	var randomCurrentMaree = Math.floor((Math.random() * 3));
	var randomNextMaree = Math.floor((Math.random() * 3));
	var datas = {
		tour: 0,
		tourPlayer: 0,
		tourPoints: 15,
		currentMaree: MAREES[randomCurrentMaree],
		nextMaree: MAREES[randomNextMaree],
		players: [
			// C'est très important que l'id des joueurs suive l'ordre de 
			// l'index du tableau car on les indexe par l'id ensuite
			// TODO N'utiliser que l'id comme identifiant
			new Player(0, 'Damien'),
			new Player(1, 'Noémie')
		],
		pieces: [
			new Piece(1, PIECE_TYPE.TANK, 2, 9), 
			new Piece(1, PIECE_TYPE.TANK, 3, 9), 
			// new Piece(2, 1, PIECE_TYPE.TANK, 2, 8), 
			new Piece(0, PIECE_TYPE.TANK, 5, 9), 
			new Piece(0, PIECE_TYPE.TANK, 6, 9), 
			new Piece(0, PIECE_TYPE.TANK, 6, 8), 
			new Piece(0, PIECE_TYPE.TANK, 7, 8),
			new Piece(0, PIECE_TYPE.TANK, 7, 7),
			new Piece(1, PIECE_TYPE.TANK, 33, 11),
			new Piece(1, PIECE_TYPE.TANK, 34, 12), 
			new Piece(1, PIECE_TYPE.TANK, 34, 13),
			new Piece(0, PIECE_TYPE.BARGE, 7, 9, ORIENTATION.SO),
			new Piece(1, PIECE_TYPE.BARGE, 33, 12, ORIENTATION.SO)
		]
	}
	// console.log('datas.pieces: ' + JSON.stringify(datas.pieces));

	this.plateau = plateau;

	this.init = function() {
		var randomMaree = Math.floor((Math.random() * 3));
		datas.currentMaree = MAREES[randomMaree];
		randomMaree = Math.floor((Math.random() * 3));
		datas.nextMaree = MAREES[randomMaree];
		this.reloadMunitionOnDestroyers();
		datas.tourPoints = 15;
	}

	this.getRefereeRuntimeMode = function() {
		return refereeRuntimeMode;
	}
	/**
	 * Retourne le joueur courant si aucune pièce n'est pas passée en paramètre.
	 * Retourne le joueur de la pièce passée en paramètre
	 */
	this.getPlayer = function(pieceId) {
		if (pieceId == null) {
			return datas.players[datas.tourPlayer];
		} else {
			return this.getPlayerById(_getPieceById(pieceId).playerId);
		}
	}
	this.getPlayers = function() {
		return datas.players;
	}
	this.getPlayerById = function(playerId) {
		var player = datas.players.filter(function(player) { 
			return player.id == this.playerId;
		}, {playerId: playerId})[0];
		if (player == null) {
			console.log('Pas de player #' + playerId + ' dans la partie.');
		}
		return player;
	}

	this.countPlayers = function() {
		return datas.players.length;
	}
	this.getTourPoints = function() {
		return datas.tourPoints;
	}
	this.getTourPlayer = function() {
		return datas.tourPlayer;
	}
	this.getPieceById = function(pieceId) {
		var piece = datas.pieces.filter(function(piece) {
			return piece.id == this.pieceId;
		}, {pieceId: pieceId} )[0];
		if (piece == null) {
			// console.log('Pas de piece #' + pieceId + ' dans la partie.');
			return null;
		}
		return {
			id: piece.id,
			pieceType: piece.pieceType,
			x: piece.x,
			y: piece.y,
			orientation: piece.orientation,
			contenu: piece.contenu,			
			nbAmmos: piece.nbAmmos
		};
	}
	var _getPieceById = function(pieceId) {
		var piece = datas.pieces.filter(function(piece) {
			return piece.id == this.pieceId;
		}, {pieceId: pieceId} )[0];
		if (piece == null) {
			console.log('Pas de piece #' + pieceId + ' dans la partie.');
		}
		return piece;
	}
	this.setPieceToCase = function(pieceId, coords, orientation) {
		var piece = _getPieceById(pieceId);
		piece.x = coords.x;
		piece.y = coords.y;
		if (orientation != null) {
			piece.orientation = orientation;
		}
	}
	var _setPieceToCase = function(piece, coords, orientation) {
		piece.x = coords.x;
		piece.y = coords.y;
		if (orientation != null) {
			piece.orientation = orientation;
		}
	}
	/*
	 * Retourne la piece posee sur l'instance de la case en fonction de la partie.
	 * Retourne null s'il n'y a pas de piece sur la case
	 * TODO Supprimer en liant la piece a la case dans le model (supprimer les coordonnées x/y des pieces)
	 */
	this.getPieceIfAvailable = function(targetCase) {
		var pieces = datas.pieces;
		for (var id in pieces) {
			var piece = pieces[id];
			// Match !
			if (targetCase.x == piece.x 
				&& targetCase.y == piece.y) {
				return piece;
			}
		}
		return null;
	}
	this.getPieces = function() {
		return datas.pieces;
	}
	this.isPieceOwnedByCurrentPlayer = function(pieceId) {
		return _getPieceById(pieceId).playerId == this.getPlayer().id;
	}
	this.getCurrentMaree = function() {
		return datas.currentMaree;
	}
	this.getNextMaree = function() {
		return datas.nextMaree;
	}	
	this.setTourToNextPlayer = function() {
		// Avant de changer de tour, on récupère les points économisés du player
		if (datas.tourPoints >= 10) {
			this.getPlayer().pointsEconomise = 10;
		} else if (datas.tourPoints >= 5 && datas.tourPoints < 10) {
			this.getPlayer().pointsEconomise = 5;
		} else {
			this.getPlayer().pointsEconomise = 0;
		}

		// Joueur suivant
		datas.tourPlayer = (datas.tourPlayer + 1) % datas.players.length;
		if (datas.tourPlayer == 0) {
			datas.tour ++;
			// Changement de marée et détermination de la marée suivante
			var randomMaree = Math.floor((Math.random() * 3));
			datas.currentMaree = datas.nextMaree;
			datas.nextMaree = MAREES[randomMaree];
			// Chargement des munitions de toutes les pieces de type destroyer
			this.reloadMunitionOnDestroyers();
		}
		datas.tourPoints = 15 + this.getPlayer().pointsEconomise;
	}

	this.reloadMunitionOnDestroyers = function() {
		datas.pieces.filter(function(piece) {
			return piece.pieceType.destroyer;
		})
		.forEach(function(destroyer) {
			// destroyer.contenu = [
			// 	new Piece(destroyer.playerId, PIECE_TYPE.MUNITION, -1, -1),
			// 	new Piece(destroyer.playerId, PIECE_TYPE.MUNITION, -1, -1)
			// ]
			destroyer.nbAmmos = 2;
		});
		
		// Destroyers contenus dans des transporteurs
		datas.pieces.filter(function(piece) {
			return piece.pieceType.transporter
		})
		.forEach(function(transporter) {
			transporter.contenu.filter(function(pieceId) {
				return _getPieceById(pieceId).pieceType.destroyer;
			})
			.forEach(function(destroyer) {
				// destroyer.contenu = [
				// 	new Piece(destroyer.playerId, PIECE_TYPE.MUNITION, -1, -1),
				// 	new Piece(destroyer.playerId, PIECE_TYPE.MUNITION, -1, -1)
				// ]
				destroyer.nbAmmos = 2;
			});
		});
	}
	/*
	 * @PartieService
	 */
	this.getCase = function(x, y) {
		return this.plateau[y][x];
	}
	/*
	 * @PartieService
	 * Retoune la case (type FMPCase) sur laquelle la piece est posee.
	 */
	this.getCasePiece = function(piece) {
		return this.plateau[piece.y][piece.x];
	}
	/*
	 * @PartieService car utilise getCase et getPieceIfAvailable
	 */
	this.getEnemiesThatCanAttackInRange = function(x, y, playerId) {
		var enemiesInRange = [];
		var parite = x & 1;

		for (var i = 0; i < ZONE_VERIFICATION_MENACE_TIR.length; i++) {
			var relativeCase = ZONE_VERIFICATION_MENACE_TIR[i];
			var currentX = x + relativeCase.x;;

			if (currentX >= 0
				&& currentX < PLATEAU_WIDTH) {
				var currentY;
				if (parite == 0) {
					currentY = y + relativeCase.y;
				} else {
					currentY = y - relativeCase.y;						
				}
				if (currentY >= 0
					&& currentY < PLATEAU_HEIGHT) {
					var caseToCheck = this.getCase(currentX, currentY);
					var pieceToCheck = this.getPieceIfAvailable(caseToCheck);
					
					if (pieceToCheck != null 
						&& pieceToCheck.playerId != playerId
						&& pieceToCheck.pieceType.destroyer) {

						var portee = pieceToCheck.pieceType.attackRange;
						if (caseToCheck.caseType == CASE_TYPE.MONTAGNE
							&& pieceToCheck.pieceType == PIECE_TYPE.TANK) {
							portee++;
						}

						if (portee >= relativeCase.distance) {
							// console.log('destructeur ennemi detecte en x: ' + pieceToCheck.x + ', y: ' + pieceToCheck.y);
							enemiesInRange.push(pieceToCheck);
						}
					}
				}
				// Sinon la case à checker est hors de la map on passe à la suite
			}
		}
		return enemiesInRange;
	}
	/*
	 * @PartieService car utilise getCase et getPieceIfAvailable
	 */
	this.countEnemiesThatCanAttackInRange = function(x, y, playerId) {
		var parite = x & 1;
		var nbDestructeurEnnemisDansZone = 0;

		for (var i = 0; i < ZONE_VERIFICATION_MENACE_TIR.length; i++) {
			var relativeCase = ZONE_VERIFICATION_MENACE_TIR[i];
			var currentX = x + relativeCase.x;;

			if (currentX >= 0
				&& currentX < PLATEAU_WIDTH) {
				var currentY;
				if (parite == 0) {
					currentY = y + relativeCase.y;
				} else {
					currentY = y - relativeCase.y;						
				}
				if (currentY >= 0
					&& currentY < PLATEAU_HEIGHT) {
					var caseToCheck = this.getCase(currentX, currentY);
					var pieceToCheck = this.getPieceIfAvailable(caseToCheck);
					
					if (pieceToCheck != null 
						&& pieceToCheck.playerId != playerId
						&& pieceToCheck.pieceType.destroyer) {

						var portee = pieceToCheck.pieceType.attackRange;
						if (caseToCheck.caseType == CASE_TYPE.MONTAGNE
							&& pieceToCheck.pieceType == PIECE_TYPE.TANK) {
							portee++;
						}

						if (portee >= relativeCase.distance) {
							// console.log('destructeur ennemi detecte en x: ' + pieceToCheck.x + ', y: ' + pieceToCheck.y);
							nbDestructeurEnnemisDansZone++;

						}
					}
				}
				// Sinon la case à checker est hors de la map on passe à la suite
			}
		}
		return nbDestructeurEnnemisDansZone;
	}
	// console.log(JSON.stringify(this));
	this.isFreeFromEnemyFire = function(pieceOrCase) {
		var playerId = this.getPlayer().id;

		if (pieceOrCase instanceof Piece) {
			playerId = pieceOrCase.playerId;
		}

		if (this.countEnemiesThatCanAttackInRange(pieceOrCase.x, pieceOrCase.y, playerId) < 2) {
			// Fo vérifier au cas ou ce n'est pas une barge, la case avant est concernée aussi
			if (pieceOrCase instanceof Piece && pieceOrCase.pieceType == PIECE_TYPE.BARGE) {
				var caseAvantBargeCoords = tools.getCoordsCaseAvantBarge(pieceOrCase);
				if (this.countEnemiesThatCanAttackInRange(caseAvantBargeCoords.x, caseAvantBargeCoords.y, playerId) < 2) {
					return true;
				} else {
					// console.log('L\'avant de la barge est sous le feu ennemi');
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
	this.removeToursPoints = function(nbPointsToRemove) {
		datas.tourPoints -= nbPointsToRemove;
	}
	this.removePiece = function(pieceId) {
		var piece = _getPieceById(pieceId);
		var index = datas.pieces.indexOf(piece);
		datas.pieces.splice(index, 1);
	}
	this.chargePiece = function(pieceTransporterId, pieceAChargerId) {
		var pieceTransporter = _getPieceById(pieceTransporterId);
		var pieceACharger = _getPieceById(pieceAChargerId);
		// On déplace le tank du plateau de la partie au contenu du transporteur
		pieceTransporter.addContenu(pieceACharger.id);
		// var indexInPieces = partie.getPieces().indexOf(pieceACharger);
		// partie.getPieces().splice(indexInPieces, 1);
		_setPieceToCase(pieceACharger, {x: -1, y: -1});
	}

	this.dechargePiece = function(pieceTransporterId, pieceADechargerId, targetCase) {
		var pieceTransporter = _getPieceById(pieceTransporterId);
		var pieceADecharger = _getPieceById(pieceADechargerId);
		var index = pieceTransporter.getContenu().indexOf(pieceADechargerId);
		if (index == -1) {
			throw 'Impossible de décharger un ' + pieceADecharger.pieceType.name + ' car le ' + pieceTransporter.pieceType.name + " n'en contient pas";
		} else {
			// this.getPieces().push(pieceADecharger);
			pieceTransporter.getContenu().splice(index, 1);
			_setPieceToCase(pieceADecharger, targetCase);
		}

	}
}
