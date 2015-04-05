var Partie = function(plateau) {
	this.plateau = plateau;
	this.tour = 0;
	this.players = [
		new Player('Damien'),
		new Player('Noémie')
	];
	this.tourPlayer = 0;
	this.pieces = [
		new Piece(this.players[1], PIECE_TYPE.TANK, 2, 9), 
		new Piece(this.players[1], PIECE_TYPE.TANK, 3, 9), 
		new Piece(this.players[1], PIECE_TYPE.TANK, 2, 8), 
		new Piece(this.players[0], PIECE_TYPE.TANK, 5, 9), 
		new Piece(this.players[0], PIECE_TYPE.TANK, 6, 9), 
		new Piece(this.players[0], PIECE_TYPE.TANK, 7, 8),
		new Piece(this.players[1], PIECE_TYPE.TANK, 33, 11),
		new Piece(this.players[1], PIECE_TYPE.TANK, 34, 12), 
		new Piece(this.players[1], PIECE_TYPE.TANK, 34, 13),
		new Piece(this.players[0], PIECE_TYPE.BARGE, 7, 9, ORIENTATION.SO),
		new Piece(this.players[1], PIECE_TYPE.BARGE, 33, 12, ORIENTATION.SO)
	];

	this.init = function() {
		var randomMaree = Math.floor((Math.random() * 3));
		this.currentMaree = MAREES[randomMaree];
		randomMaree = Math.floor((Math.random() * 3));
		this.nextMaree = MAREES[randomMaree];
		this.reloadMunitionOnDestroyers();
		this.tourPoints = 15;		
	}
	this.getPlayer = function() {
		return this.players[this.tourPlayer];
	}
	this.setTourToNextPlayer = function() {
		// Avant de changer de tour, on récupère les points économisés du player
		if (this.tourPoints >= 10) {
			this.getPlayer().pointsEconomise = 10;
		} else if (this.tourPoints >= 5 && this.tourPoints < 10) {
			this.getPlayer().pointsEconomise = 5;
		} else {
			this.getPlayer().pointsEconomise = 0;
		}

		// Joueur suivant
		this.tourPlayer = (this.tourPlayer + 1) % this.players.length;
		if (this.tourPlayer == 0) {
			this.tour ++;
			// Changement de marée et détermination de la marée suivante
			var randomMaree = Math.floor((Math.random() * 3));
			this.currentMaree = this.nextMaree;
			this.nextMaree = MAREES[randomMaree];
			// Chargement des munitions de toutes les pieces de tupe destroyer
		}
		this.tourPoints = 15 + this.getPlayer().pointsEconomise;
	}

	this.reloadMunitionOnDestroyers = function() {
		this.pieces.filter(function(piece) {
			return piece.pieceType.destroyer;
		})
		.forEach(function(destroyer) {
			destroyer.contenu = [
				new Piece(destroyer.player, PIECE_TYPE.MUNITION, -1, -1),
				new Piece(destroyer.player, PIECE_TYPE.MUNITION, -1, -1)
			]
		});
		
		// Destroyer contenues dans des transporteurs
		this.pieces.filter(function(piece) {
			return piece.pieceType.transporter
		})
		.forEach(function(transporter) {
			transporter.contenu.filter(function(piece) {
				return piece.pieceType.destroyer;
			})
			.forEach(function(destroyer) {
				destroyer.contenu = [
					new Piece(destroyer.player, PIECE_TYPE.MUNITION, -1, -1),
					new Piece(destroyer.player, PIECE_TYPE.MUNITION, -1, -1)
				]
			});
		});
	}
	/*
	 * @PartieService
	 * Retourne la piece posee sur l'instance de la case en fonction de la partie.
	 * Retourne null s'il n'y a pas de piece sur la case
	 * TODO Supprimer en liant la piece a la case dans le model (supprimer les coordonnées x/y des pieces)
	 */
	this.getPieceIfAvailable = function(targetCase) {
		var pieces = this.pieces;
		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			// Match !
			if ((targetCase.x == piece.x) 
				&& (targetCase.y == piece.y)) {
				return piece;
			}
		}
		return null;
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
	 * @PartieService
	 */
	this.getSelectedPiece = function () {
		return this.getPlayer().selectedPiece;
	}
	/*
	 * @PartieService
	 */
	this.setSelectedPiece = function (piece) {
		this.getPlayer().selectedPiece = piece;
		this.setSelectedPieceSoute(null);
	}
	/*
	 * @PartieService
	 */
	this.getSelectedPieceSoute = function () {
		return this.getPlayer().selectedPieceSoute;
	}
	/*
	 * @PartieService
	 */
	this.setSelectedPieceSoute = function(piece) {
		this.getPlayer().selectedPieceSoute = piece;
	}
	this.clearSelectedPieceSoute = function() {
		this.getPlayer().selectedPieceSoute = null;
	}

	/*
	 * @PartieService car utilise getCase et getPieceIfAvailable
	 */
	this.getEnemiesThatCanAttackInRange = function(x, y, player) {
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
						&& pieceToCheck.player != player
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
	this.countEnemiesThatCanAttackInRange = function(x, y, player) {
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
						&& pieceToCheck.player != player
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
	this.init();
}
