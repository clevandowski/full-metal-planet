var Partie = function(plateau) {
	this.plateau = plateau;
	this.tour = 0;
	this.players = [
		new Player('Damien'),
		new Player('Noémie')
	];
	this.tourPlayer = 0;
	this.getPlayer = function() {
		return this.players[this.tourPlayer];
	}
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

	this.setTourToNextPlayer = function(init) {
		if (init == true) {
			var randomMaree = Math.floor((Math.random() * 3));
			this.currentMaree = MAREES[randomMaree];
			randomMaree = Math.floor((Math.random() * 3));
			this.nextMaree = MAREES[randomMaree];
		} else {
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
		}
		this.reloadMunitionOnDestroyers();
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

	this.setTourToNextPlayer(true);
}
