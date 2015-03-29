// document.addEventListener('click', function(e) {
//     e = e || window.event;
//     var target = e.target || e.srcElement;
//     // , text = target.textContent || text.innerText;
//     console.log(target);
// }, false);
/*
 * constants
 */

var PLATEAU_WIDTH = 37;
var PLATEAU_HEIGHT = 23;

/* 
 * enums & static arrays
 */
var MAREES = [
	{ value: 'B', name: 'BASSE'},
	{ value: 'N', name: 'NORMALE'},
	{ value: 'H', name: 'HAUTE'} 
];

var CASE_TYPE = {
	PLAINE: { name: 'plaine' },
	MONTAGNE: { name: 'montagne' },
	MARECAGE: { name: 'marecage' },
	RECIF: { name: 'recif' },
	MER: { name: 'mer' }
};

var CASE_TYPE_MAREE = [
	{ name: 'plaine', cssName: 'plaine', caseType: CASE_TYPE.PLAINE, marees: [ 'B', 'N', 'H' ], modeDeplacement: 'terrestre' },
	{ name: 'montagne', cssName: 'montagne', caseType: CASE_TYPE.MONTAGNE, marees: [ 'B', 'N', 'H' ], modeDeplacement: 'terrestre' },
	{ name: 'marecage-sec', cssName: 'marecage-sec', caseType: CASE_TYPE.MARECAGE, marees: [ 'B', 'N' ], modeDeplacement: 'terrestre' },
	{ name: 'marecage-inonde', cssName: 'marecage-inonde', caseType: CASE_TYPE.MARECAGE, marees: [ 'H' ], modeDeplacement: 'maritime' },
	{ name: 'recif-sec', cssName: 'recif-sec', caseType: CASE_TYPE.RECIF, marees: [ 'B' ], modeDeplacement: 'terrestre' },
	{ name: 'recif-inonde', cssName: 'recif-inonde', caseType: CASE_TYPE.RECIF, marees: [ 'N', 'H' ], modeDeplacement: 'maritime' },
	{ name: 'mer', cssName: 'mer', caseType: CASE_TYPE.MER, marees: [ 'B', 'N', 'H' ], modeDeplacement: 'maritime' }
];


// encombrement = nb de place prise sur un crabe ou une barge
var PIECE_TYPE = {
	MUNITION: {name: 'munition', cssName: 'munition', mobile: false, modeDeplacement: 'none', encombrement: 1, transporter: false, transportCapacite: -1, destroyer: false, attackRange: -1},
	TANK: { name: 'tank', cssName: 'tank', mobile: true, modeDeplacement: 'terrestre', encombrement: 1, transporter: false, transportCapacite: -1, destroyer: true, attackRange: 2 },
	BARGE: { name: 'barge', cssName: 'barge', mobile: true, modeDeplacement: 'maritime', encombrement: 4, transporter: true, transportCapacite: 4, destroyer: false, attackRange: -1 }
}

var ORIENTATION = {
	N: { name: 'nord', cssName: 'orientation-nord', next: 'NE', previous: 'NO' },
	NE: { name: 'nord-est', cssName: 'orientation-nord-est', next: 'SE', previous: 'N' },
	SE: { name: 'sud-est', cssName: 'orientation-sud-est', next: 'S', previous: 'NE' },
	S: { name: 'sud', cssName: 'orientation-sud', next: 'SO', previous: 'SE' },
	SO: { name: 'sud-ouest', cssName: 'orientation-sud-ouest', next: 'NO', previous: 'S' },
	NO: { name: 'nord-ouest', cssName: 'orientation-nord-ouest', next: 'N', previous: 'SO' }
}

// Pair
//
//   OOO
// OOOOOOO
// OOOOOOO
// OOOXOOO
// OOOOOOO
//  OOOOO
//    O
//
//
// Impair
//    O
//  OOOOO
// OOOOOOO
// OOOXOOO
// OOOOOOO
// OOOOOOO
//   OOO
//
// On cale sur les cases paires en X
// Mais pour gérer en impair on fait simplement y = -y;
var ZONE_VERIFICATION_MENACE_TIR = [
	{ x: -1, y: -3, distance: 3 }, 
	{ x: 0, y: -3, distance: 3 }, 
	{ x: 1, y: -3, distance: 3 },
	{ x: -3, y: -2, distance: 3 }, 
	{ x: -2, y: -2, distance: 3 }, 
	{ x: -1, y: -2, distance: 2 }, 
	{ x: 0, y: -2, distance: 2 }, 
	{ x: 1, y: -2, distance: 2 }, 
	{ x: 2, y: -2, distance: 3 }, 
	{ x: 3, y: -2, distance: 3 },
	{ x: -3, y: -1, distance: 3 }, 
	{ x: -2, y: -1, distance: 2 }, 
	{ x: -1, y: -1, distance: 1 }, 
	{ x: 0, y: -1, distance: 1 }, 
	{ x: 1, y: -1, distance: 1 }, 
	{ x: 2, y: -1, distance: 2 }, 
	{ x: 3, y: -1, distance: 3 },
	{ x: -3, y: 0, distance: 3 }, 
	{ x: -2, y: 0, distance: 2 }, 
	{ x: -1, y: 0, distance: 1 }, 
	{ x: 1, y: 0, distance: 1 }, 
	{ x: 2, y: 0, distance: 2 }, 
	{ x: 3, y: 0, distance: 3 },
	{ x: -3, y: 1, distance: 3 }, 
	{ x: -2, y: 1, distance: 2 }, 
	{ x: -1, y: 1, distance: 2 }, 
	{ x: 0, y: 1, distance: 1 }, 
	{ x: 1, y: 1, distance: 2 }, 
	{ x: 2, y: 1, distance: 2 }, 
	{ x: 3, y: 1, distance: 3 },
	{ x: -2, y: 2, distance: 3 }, 
	{ x: -1, y: 2, distance: 3 }, 
	{ x: 0, y: 2, distance: 2 }, 
	{ x: 1, y: 2, distance: 3 }, 
	{ x: 2, y: 2, distance: 3 },
	{ x: 0, y: 3, distance: 3 }
]
/* 
 * models
 */
var FMPCase = function(caseType, x, y) {
	this.caseType = caseType;
	this.x = x;
	this.y = y;
	this.explose = false;

	this.getCaseTypeMaree = function(maree) {
		return CASE_TYPE_MAREE.filter(function(caseTypeMaree) {
				return caseTypeMaree.caseType == caseType;
			}).filter(function(caseTypeMaree) {
				return caseTypeMaree.marees.indexOf(maree.value) > -1;
			})[0];
	}
}

var Piece = function(player, pieceType, x, y, orientation) {
	this.player = player;
	this.pieceType = pieceType;
	this.x = x;
	this.y = y;
	this.contenu = [];

	if (orientation == null) {
		this.orientation = ORIENTATION.S;
	} else {
		this.orientation = orientation;
	}
	this.addContenu = function(piece) {
		if (piece == null) {
			throw 'Piece vide !';
		} else {
			this.contenu.push(piece);
		}
	}
	this.getContenu = function() {
		return this.contenu;
	}
}

var Player = function(name) {
	this.name = name;
	this.pointsEconomise = 0;
	this.selectedPiece = null;
	this.selectedPieceSoute = null;
}

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

/* 
 * engine
 */
var Engine = function(partie) {
	/*
	 * Initialisations
	 */
	this.partie = partie;

	this.getSelectedPiece = function () {
		return this.partie.getPlayer().selectedPiece;
	}
	this.setSelectedPiece = function (piece) {
		this.partie.getPlayer().selectedPiece = piece;
	}
	this.getSelectedPieceSoute = function () {
		return this.partie.getPlayer().selectedPieceSoute;
	}
	this.setSelectedPieceSoute = function(piece) {
		this.partie.getPlayer().selectedPieceSoute = piece;
	}

	/*
	 * Fonctions CSS
	 */
	this.cssSelectedPiece = function(targetCase) {
	 	if (this.getSelectedPiece() != null) {
	 		if ((targetCase.x == this.getSelectedPiece().x)
	 			&& (targetCase.y == this.getSelectedPiece().y)) {
	 			return 'selectedPiece';
	 		}
	 		// TODO Corriger la css pour que le résultat sur la barge ne soit pas
	 		// trop horrible
	 		// else if (this.getSelectedPiece().pieceType == PIECE_TYPE.BARGE) {
	 		// 	var caseBarge = this.getCasePiece(this.getSelectedPiece());
	 		// 	var caseAvantBarge = 
	 		// 		this.getNextCaseInOrientation(caseBarge, this.getSelectedPiece().orientation);
				// if ((targetCase.x == caseAvantBarge.x)
			 // 		&& (targetCase.y == caseAvantBarge.y)) {
				//  	return 'selectedPiece';
				// }
	 		// }	
	 	}
	}

	this.cssSelectedPieceSoute = function(targetCase) {
	 	if (this.getSelectedPieceSoute() != null) {
	 		if ((targetCase.x == this.getSelectedPieceSoute().x)
	 			&& (targetCase.y == this.getSelectedPieceSoute().y)) {
	 			return 'selectedPiece';
	 		}
	 	}
	 }

	/*
	 * Fonctions Lecture Ecriture Cases / Pieces
	 */
	/*
	 * Retoune la case (type FMPCase) sur laquelle la piece est posee.
	 */
	this.getCasePiece = function(piece) {
		return this.partie.plateau[piece.y][piece.x];
	}
	this.setPieceToCase = function(piece, hexagonalCase) {
		piece.x = hexagonalCase.x;
		piece.y = hexagonalCase.y;
	}
	this.centerPlateauOnCoordinates = function(x, y) {
		// C'est un peu à l'arrache mais ça permet d'eviter d'avoir a scroller pour trouver 
		// la derniere unite selectionnee
		$('#container').scrollLeft(x * 90 - 755);
		$('#container').scrollTop(y * 102 - 298);
	}
	this.centerPlateau = function() {
		if (this.getSelectedPiece() != null) {
			this.centerPlateauOnCoordinates(this.getSelectedPiece().x, this.getSelectedPiece().y);
		} else {
			var player = this.partie.getPlayer();
			var barge = this.partie.pieces.filter(
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
	 * Retourne la piece posee sur l'instance de la case en fonction de la partie.
	 * Retourne null s'il n'y a pas de piece sur la case
	 * TODO Supprimer en liant la piece a la case dans le model (supprimer les coordonnées x/y des pieces)
	 */
	this.getPieceIfAvailable = function(hexagonalCase) {
		var pieces = this.partie.pieces;
		for (var i = 0; i < pieces.length; i++) {
			var piece = pieces[i];
			// Match !
			if ((hexagonalCase.x == piece.x) 
				&& (hexagonalCase.y == piece.y)) {
				return piece;
			}
		}
		return null;
	}
	this.getCase = function(x, y) {
		return this.partie.plateau[y][x];
	}

	this.areCoordinatesInRadius = function(x0, y0, x1, y1, radius) {
		var deltaX = x1 - x0;
		var deltaY = y1 - y0;

		// Si les cases sont en quinconce
		if (deltaX & 1 != 0) {
			// On cale la parité sur la 1ere case
			var pariteX = x0 & 1;
			pariteX = 0.5 - pariteX;
			deltaY += pariteX;
		}

		// console.log('pariteX: ' + pariteX + ', deltaX: ' + deltaX + ', deltaY: ' + deltaY);
		var sommeCotesAuCarre = (deltaX * deltaX) + (deltaY * deltaY);
		var radiusAuCarre = radius * radius;
		// console.log("sommeCotesAuCarre: " + sommeCotesAuCarre);
		// Le coup de radiusAuCarre + radius c pas très scientifique mais
		// ça marche jusqu'à 3 case de rayons, ce qui suffit au besoin
		// Apres ça marche plus fo trouver plus fin
		if (sommeCotesAuCarre < (radiusAuCarre + radius)) {
			return true;
		} else {
			return false;
		}
	}
	this.areCoordinatesAdjacent = function(x0, y0, x1, y1) {
		return this.areCoordinatesInRadius(x0, y0, x1, y1, 1);
	}

	this.getNextCaseInOrientation = function(startCase, orientation) {
		var targetX = startCase.x;
		var targetY = startCase.y;

		var parite = startCase.x & 1;

		switch(orientation) {
			case ORIENTATION.N:
				targetY = targetY - 1;
				break;
			case ORIENTATION.NE:
				targetX = targetX + 1;
				targetY = targetY - (1 - parite);
				break;
			case ORIENTATION.SE:
				targetX = targetX + 1;
				targetY = targetY + parite;
				break;
			case ORIENTATION.S:
				targetY = targetY + 1;
				break;
			case ORIENTATION.SO:
				targetX = targetX - 1;
				targetY = targetY + parite;
				break;
			case ORIENTATION.NO:
				targetX = targetX - 1;
				targetY = targetY - (1 - parite);
				break;
			default:
				throw 'Orientation ' + orientation.name + ' unknown';
				break;
		}

		return this.getCase(targetX, targetY);
	}
	this.getOrientation = function(startCase, targetCase) {
		var deltaX = targetCase.x - startCase.x;
		var deltaY = targetCase.y - startCase.y;

		if (deltaX == 0) {
			if (deltaY > 0) {
				return ORIENTATION.S;
			} else {
				return ORIENTATION.N;
			}
		} else {
			var pariteX = startCase.x & 1;
			if (pariteX == 0) {
				if (deltaY == 0) {
					if (deltaX > 0) {
						return ORIENTATION.SE;
					} else {
						return ORIENTATION.SO;
					}
				} else {
					if (deltaX > 0) {
						return ORIENTATION.NE;
					} else {
						return ORIENTATION.NO;
					}
				}
			} else {
				if (deltaY == 0) {
					if (deltaX > 0) {
						return ORIENTATION.NE;
					} else {
						return ORIENTATION.NO;
					}
				} else {
					if (deltaX > 0) {
						return ORIENTATION.SE;
					} else {
						return ORIENTATION.SO;
					}
				}
			}
		}
	}

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

	// Ou tout objet ayant le couple de propriétés x, y
	// Remplir player uniquement si c'est une case
	this.isFreeFromEnemyFire = function(pieceOrCase) {
		var player = this.partie.getPlayer();

		if (pieceOrCase instanceof Piece) {
			player = pieceOrCase.player;
		}

		if (this.countEnemiesThatCanAttackInRange(pieceOrCase.x, pieceOrCase.y, player) < 2) {
			// Fo vérifier au cas ou ce n'est pas une barge, la case avant est concernée aussi
			if (pieceOrCase instanceof Piece && pieceOrCase.pieceType == PIECE_TYPE.BARGE) {
				var caseArriereBarge = this.getCasePiece(pieceOrCase);
				var caseAvantBarge = this.getNextCaseInOrientation(caseArriereBarge, pieceOrCase.orientation);
				if (this.countEnemiesThatCanAttackInRange(caseAvantBarge.x, caseAvantBarge.y, player) < 2) {
					return true;
				} else {
					console.log('L\'avant de la barge est sous le feu ennemi');
					return false;
				}
			} else {
				return true;
			}
		} else {
			console.log('La case / piece en x: ' + pieceOrCase.x + ', y: ' + pieceOrCase.y + ' est sous le feu ennemi');
			return false;
		}
	}

	/*
	 * Règles de validation du mouvement d'une piece utilisee dans validateMove
	 * @see validateMove(piece, targetCase, maree)
	 */
	this.isPieceMovableByMaree = function(piece, maree) {
		var casePiece = this.getCasePiece(piece);
		var casePieceMaree = casePiece.getCaseTypeMaree(maree);
		if (piece.pieceType.modeDeplacement != casePieceMaree.modeDeplacement) {
			console.log('Impossible de deplacer un ' + piece.pieceType.name + ' de type ' + piece.pieceType.modeDeplacement +  ' sur une case ' + casePieceMaree.name);
			return false;
		}
		if (piece.pieceType == PIECE_TYPE.BARGE) {
			var caseAvantBarge = this.getNextCaseInOrientation(casePiece, piece.orientation);
			var caseAvantBargeMaree = caseAvantBarge.getCaseTypeMaree(maree);
			if (piece.pieceType.modeDeplacement != caseAvantBargeMaree.modeDeplacement) {
				console.log('Impossible de deplacer un ' + piece.pieceType.name + ' de type ' + piece.pieceType.modeDeplacement +  ' sur une case ' + caseAvantBargeMaree.name);
				return false;
			}
		}
		return true;
	}
	this.arePieceAndTargetCaseAdjacent = function(piece, targetCase) {
		if (this.areCoordinatesAdjacent(piece.x, piece.y, targetCase.x, targetCase.y)) {
			return true;
		} else if (piece.pieceType == PIECE_TYPE.BARGE) {
			var caseArriereBarge = this.getCasePiece(piece);
			var caseAvantBarge = this.getNextCaseInOrientation(caseArriereBarge, piece.orientation);
			return this.areCoordinatesAdjacent(caseAvantBarge.x, caseAvantBarge.y, targetCase.x, targetCase.y);
		}
		return false;
	}
	this.isPieceUsableOnTargetCaseByMaree = function(piece, targetCase, maree) {
		var targetCaseMaree = targetCase.getCaseTypeMaree(maree);
		if (piece.pieceType.modeDeplacement != targetCaseMaree.modeDeplacement) {
			// Exception : On peut obliger une unité à aller sur un endroit
			// qui la neutralise mais obligatoirement sur un type qui peut changer
			// selon la marée, donc on exclut toutes les cases non marecage ou recif
			if (targetCase.caseType != CASE_TYPE.MARECAGE
				&& targetCase.caseType != CASE_TYPE.RECIF) {
				return false;
			}
		}
		// TODO Implémenter la condition pour que le gros tas ne puisse pas monter sur une montagne
		return true;
	}
	this.isTargetCaseFree = function(targetCase) {
		if (this.getPieceIfAvailable(targetCase) == null) {
			return true;
		}
		console.log('La case (x: ' + targetCase.x + ', y: ' + targetCase.y + ') contient deja une piece');
		return false;
	}
	/*
	 * Retourne true si le deplacement de la piece sur la case targetCase est possible.
	 * Cad toutes les règles suivantes doivent être vérifiées :
	 * - La case de depart doit etre praticable pour la piece en fonction de la maree
	 * - La piece doit etre mobile (pas un minerai)
	 * - La case cible doit etre adjacente à la piece
	 * - La case cible ne doit pas deja contenir de piece
	 * - La piece est un gros tas et la case cible n'est pas de type montagne
	 *
	 * TODO
	 * Ajout issu de http://jeuxstrategie.free.fr/Full_metal_planete_complet.php
	 * 
	 * - Il est possible d'échouer volontairement un engin marin ou d'embourber volontairement un engin terrestre dans ce cas, l'engin doit
	 *   s'arrêter sur la première case qui lui est momentanément impraticable, et se retrouve neutralisé.
	 *
	 */
	this.validateMove = function(piece, targetCase, maree) {
		return this.isPieceMovableByMaree(piece, maree)
			&& piece.pieceType.mobile
			&& this.arePieceAndTargetCaseAdjacent(piece, targetCase)
			&& this.isPieceUsableOnTargetCaseByMaree(piece, targetCase, maree)
			&& this.isTargetCaseFree(targetCase)
			&& this.isFreeFromEnemyFire(piece)
			&& this.isFreeFromEnemyFire(targetCase);
	}
	this.movePieceToCase = function(piece, targetCase) {
		if (piece.pieceType == PIECE_TYPE.BARGE) {
			// Si c'est une case adjacente à l'arriere de la barge, on tourne, 
			// ATTENTION on ne peux pas utiliser this.arePieceAndTargetAdjacent 
			//car il tient compte du fait que c'est une barge alors qu'on cherche 
			//juste à savoir si c'est la base de la barge qui est adjacente à la case ici
			if (this.areCoordinatesAdjacent(piece.x, piece.y, targetCase.x, targetCase.y)) {
				piece.orientation = this.getOrientation(piece, targetCase);
			} else {
				// Sinon on avance.
				// La case cible et la case avant de la barge sont forcément adjacentes ici
				var caseAvantBarge = this.getNextCaseInOrientation(piece, piece.orientation);
				var nextOrientation = this.getOrientation(caseAvantBarge, targetCase);
				this.setPieceToCase(piece, caseAvantBarge);
				piece.orientation = nextOrientation;
			}
		} else {
			piece.orientation = this.getOrientation(piece, targetCase);
			this.setPieceToCase(piece, targetCase);
		}
	}
	// On suppose qu'on parle bine d'un crabe ou d'une barge
	this.getTransportCapaciteRestante = function(pieceTransporter) {
		var capaciteRestante = pieceTransporter.pieceType.transportCapacite;

		if (pieceTransporter.getContenu() != null 
			&& pieceTransporter.getContenu().length > 0) {

			for (var piece in pieceTransporter.getContenu()) {
				capaciteRestante -= pieceTransporter.getContenu()[piece].pieceType.encombrement;
			}
		}
		return capaciteRestante;
	}
	this.canTransporterChargePiece = function(pieceTransporter, pieceACharger) {
		if (! pieceTransporter.pieceType.transporter) {
			console.log('Un ' + pieceTransporter.pieceType.name + ' n\'a pas de capacite de transport');
			return false;
		}
		if (this.getTransportCapaciteRestante(pieceTransporter) < pieceACharger.pieceType.encombrement) {
			console.log('Capacite de maximum de transport restante (' + this.getTransportCapaciteRestante(pieceTransporter) + ') inférieure à l\'encombrement de la piece (' + pieceACharger.pieceType.encombrement + ')');
			return false;
		}
		return true;
	}
	this.isPieceChargeableByMaree = function(pieceACharger, maree) {
		var casePiece = this.getCasePiece(pieceACharger);
		var casePieceMaree = casePiece.getCaseTypeMaree(maree);
		if (pieceACharger.pieceType.modeDeplacement != casePieceMaree.modeDeplacement) {
			console.log('Impossible de deplacer un ' + pieceACharger.pieceType.name + ' de type ' + pieceACharger.pieceType.modeDeplacement +  ' sur une case ' + casePieceMaree.name);
			return false;
		}
		return true;
	}
	this.areTransporterAndPieceAdjacent = function(pieceTransporter, pieceACharger) {
		if (this.areCoordinatesAdjacent(pieceTransporter.x, pieceTransporter.y, pieceACharger.x, pieceACharger.y)) {
			return true;
		} else if (pieceTransporter.pieceType == PIECE_TYPE.BARGE) {
			var caseArriereBarge = this.getCasePiece(pieceTransporter);
			var caseAvantBarge = this.getNextCaseInOrientation(caseArriereBarge, pieceTransporter.orientation);
			return this.areCoordinatesAdjacent(caseAvantBarge.x, caseAvantBarge.y, pieceACharger.x, pieceACharger.y);
		}
		return false;
	}
	this.validateChargement = function(pieceTransporter, pieceACharger, maree) {
		return pieceTransporter != pieceACharger
			&& this.canTransporterChargePiece(pieceTransporter, pieceACharger)
			&& this.isPieceChargeableByMaree(pieceACharger, maree)
			&& this.areTransporterAndPieceAdjacent(pieceTransporter, pieceACharger)
			&& this.isFreeFromEnemyFire(pieceTransporter) 
			&& this.isFreeFromEnemyFire(pieceACharger);
	}
	this.validateDechargement = function(pieceTransporter, pieceADecharger, targetCase) {
		return this.areTransporterAndPieceAdjacent(pieceTransporter, targetCase)
			&& targetCase.caseType != CASE_TYPE.MER
			&& this.isFreeFromEnemyFire(pieceTransporter) 
			&& this.isFreeFromEnemyFire(targetCase);
	}
	this.chargePiece = function(pieceTransporter, pieceACharger) {
		console.log('Chargement de ' + pieceACharger.pieceType.name + ' dans ' + pieceTransporter.pieceType.name);
		// if (pieceTransporter.getContenu() == null) {
		// 	pieceTransporter.getContenu() = [];
		// }

		// On déplace le tank du plateau de la partie au contenu du transporteur
		pieceTransporter.addContenu(pieceACharger);
		var indexInPieces = this.partie.pieces.indexOf(pieceACharger);
		this.partie.pieces.splice(indexInPieces, 1);
	}
	this.dechargePiece = function(pieceTransporter, pieceADecharger, targetCase) {
		if (pieceTransporter.getContenu() == null) {
			console.log('Impossible de décharger car le ' + pieceTransporter.pieceType.name + ' est vide.');
			return;
		}
		var index = pieceTransporter.getContenu().indexOf(pieceADecharger);
		if (index == -1) {
			console.log('Impossible de décharger un ' + pieceADecharger.pieceType.name + ' car le ' + pieceTransporter.pieceType.name + " n'en contient pas");
		} else {
			this.partie.pieces.push(pieceADecharger);
			pieceTransporter.getContenu().splice(index, 1);
			this.setPieceToCase(pieceADecharger, targetCase);
		}
	}

	this.attack = function(piece) {
		// TODO Validation :
		// - Si plus de 2 destroyers, comment faire interagir le joueur
		var targetCase = this.getCasePiece(piece);
		var piecesAttacking = this.getEnemiesThatCanAttackInRange(targetCase.x, targetCase.y, piece.player);
		if (piecesAttacking.length > 2) {
			console.log('TODO: Pouvoir choisir les attaquants');
		}
		// Vue la condition "this.isFreeFromEnemyFire(piece)" plus
		// haut, on sait qu'il y a au moins 2 attaquants

		// Est ce qu'il reste au moins 1 munition a chaque attaquant ?
		for (var i = 0; i < piecesAttacking.length; i++) {
			if (piecesAttacking[i].contenu == null
				|| piecesAttacking[i].contenu.length == 0) {
				throw 'La piece attaquant ' + piecesAttacking[i].pieceType.name + ' ne dispose plus de munition pour ce tour.';
			}
		}

		// Attaque !
		if (! window.confirm('Attaquer l\'unité ?')) {
			throw 'Le joueur a annulé l\'attaque';
		}

		// Deduction d'une munition
		piecesAttacking.forEach(function(pieceAttacking) {
			pieceAttacking.getContenu().splice(0,1);
		});

		targetCase.explose = true;
		// C'est pas elegant mais ça sert à attendre les 4s de l'animation de 
		// l'explosion qui disparait en CSS
		setTimeout(function() {
			console.log('Piece: ' + piece.pieceType.name);
		    targetCase.explose = false;
		}, 4000);
		var index = this.partie.pieces.indexOf(piece);
		this.partie.pieces.splice(index, 1);
		this.partie.tourPoints -=2;
		console.log('Destruction de la piece ' + piece.pieceType.name + ' de ' + piece.player.name + ' par ' + this.partie.getPlayer().name);
	}

	this.onClick = function(targetCase, maree) {
		if (this.partie.tourPoints <= 0) {
			throw 'Plus aucun point d\'action restants pour le joueur ' + this.partie.getPlayer().name;
		}

		var piece = this.getPieceIfAvailable(targetCase);

		if (piece != null) {
			// Click sur une unite, selection ou action
			console.log('onClick: ' + targetCase.getCaseTypeMaree(maree).cssName + '(' + piece.pieceType.name + ', x:' + targetCase.x + ', y: ' + targetCase.y + ')');			
			if (piece.player != this.partie.getPlayer()) {
				if (! this.isFreeFromEnemyFire(piece) 
					&& this.partie.tourPoints >= 2) {
					this.attack(piece);
					return;
				} else {
					throw 'La piece n\'appartient pas au joueur ' + this.partie.getPlayer().name;
				}
			}
			// Si on a déjà une piece selectionnée, action
			// - Est ce qu'on la charge dans une barge ou un crabe ?
			if (this.getSelectedPiece() != null) {

				// if (this.getSelectedPiece() == piece) {
				// 	console.log('Deselection de la piece ' + piece.pieceType.name);
				// 	this.setSelectedPiece(null);
				// 	return;
				// }

				// Chargement ?
				if (this.validateChargement(piece, this.getSelectedPiece(), maree)) {
					// Le joueur est en train de charger selectedPiece dans un transporteur
					this.chargePiece(piece, this.getSelectedPiece());
					this.partie.tourPoints --;
				} else {
					console.log('Chargement non tente ou impossible');
				}

				// Si aucune action valide, la nouvelle piece est la piece selectionnee
				console.log('nouvelle piece selectionnee');
				this.setSelectedPiece(piece);
			} else {
				console.log('nouvelle piece selectionnee');
				this.setSelectedPiece(piece);
			}
		} else {
			// Click sur une case, tentative de déchargement ou de déplacement 
			console.log('onClick: ' + targetCase.getCaseTypeMaree(maree).cssName + '(x:' + targetCase.x 
				+ ', y: ' + targetCase.y + ')');

			// Comme la case selectionnee ne contenait pas de piece, on reutilise la variable pour 
			// la piece selectionnee
			piece = this.getSelectedPiece();

			if (piece != null) {
				// Déchargement ?
				if (this.getSelectedPieceSoute() != null) {
					if (piece.pieceType.transporter) {
						if (this.validateDechargement(piece, this.getSelectedPieceSoute(), targetCase)) {
							console.log('Déchargement de ' + this.getSelectedPieceSoute().pieceType.name 
								+ ' a partir de ' + piece.pieceType.name);
							this.dechargePiece(this.getSelectedPiece(), this.getSelectedPieceSoute(), targetCase);
							this.partie.tourPoints --;
						}
					}
					// Qque soit la situation, on délectionne la piece de la soute
					this.setSelectedPieceSoute(null);
					return;
				}

				// Déplacement ?
				if (this.validateMove(piece, targetCase, maree)) {
					this.movePieceToCase(piece, targetCase);
					this.partie.tourPoints --;
				} else {
					console.log('Deplacement impossible');
				}
			}
		}
	}
	this.onClickSoute = function(piece) {
		console.log('Piece selectionnee dans la soute : ' + piece.pieceType.name);
		this.setSelectedPieceSoute(piece);
	}

	this.onRightClick = function(x, y) {
		// var targetCase = this.getCase(x, y);
		// var piece = this.getPieceIfAvailable(targetCase);
		// console.log('orientation : ' + piece.orientation.name + ', next :' + piece.orientation.next);
		// piece.orientation = ORIENTATION[piece.orientation.next];
	}

	this.centerPlateau();
}

/* 
 * datas
 */
var PLATEAU = [
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,		
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE
	], 
	[
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE
	],
	[
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	[
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.RECIF,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	// L16
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.RECIF,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	// L17
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	// L18
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	// L19
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.RECIF,
		CASE_TYPE.RECIF,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	// L20
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	// L21
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MER,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	// L22
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MER,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	],
	// L23
	[
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MER,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MONTAGNE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.MARECAGE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE,
		CASE_TYPE.PLAINE
	]
];

// function initCase(element, index, array) {
// 	console.log("element: " + element.name);
// }

// function initLine(element, index, array) {
// 	element.forEach(initCase);
// }

// PLATEAU.forEach(initLine);

function initPlateau(PLATEAU) {
	var plateau = [];

	for (j = 0; j < PLATEAU.length; j++) {
		var line = PLATEAU[j];
		plateau[j] = [];
		for (i = 0; i < line.length; i++) {
			var caseType = line[i];
			plateau[j][i] = new FMPCase(caseType, i, j);
		}
	}

	return plateau;
}
