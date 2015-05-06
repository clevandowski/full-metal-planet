var Tools = function(fmpConstants) {
	/*
	 * @UtilService
	 */
	var _areCoordinatesInRadius = function(x0, y0, x1, y1, radius) {
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
	
	/*
	 * @UtilService
	 */
	this.areCoordinatesAdjacent = function(x0, y0, x1, y1) {
		return _areCoordinatesInRadius(x0, y0, x1, y1, 1);
	}

	/*
	 * @UtilService
	 * @return Un objet { x, y } des coordonnées cible
	 */
	this.getCaseCoordsInOrientation = function(startCase, orientation) {
		var targetX = startCase.x;
		var targetY = startCase.y;

		var parite = startCase.x & 1;

		switch(orientation.value) {
			case fmpConstants.ORIENTATION.N.value:
				targetY = targetY - 1;
				break;
			case fmpConstants.ORIENTATION.NE.value:
				targetX = targetX + 1;
				targetY = targetY - (1 - parite);
				break;
			case fmpConstants.ORIENTATION.SE.value:
				targetX = targetX + 1;
				targetY = targetY + parite;
				break;
			case fmpConstants.ORIENTATION.S.value:
				targetY = targetY + 1;
				break;
			case fmpConstants.ORIENTATION.SO.value:
				targetX = targetX - 1;
				targetY = targetY + parite;
				break;
			case fmpConstants.ORIENTATION.NO.value:
				targetX = targetX - 1;
				targetY = targetY - (1 - parite);
				break;
			default:
				throw 'Orientation unknown: ' + JSON.stringify(orientation);
				break;
		}

		// return partie.getCase(targetX, targetY);
		return { x: targetX, y: targetY };
	}
	/*
	 * @UtilService
	 */
	this.getOrientation = function(startCase, targetCase) {
		var deltaX = targetCase.x - startCase.x;
		var deltaY = targetCase.y - startCase.y;

		if (deltaX == 0) {
			if (deltaY > 0) {
				return fmpConstants.ORIENTATION.S;
			} else {
				return fmpConstants.ORIENTATION.N;
			}
		} else {
			var pariteX = startCase.x & 1;
			if (pariteX == 0) {
				if (deltaY == 0) {
					if (deltaX > 0) {
						return fmpConstants.ORIENTATION.SE;
					} else {
						return fmpConstants.ORIENTATION.SO;
					}
				} else {
					if (deltaX > 0) {
						return fmpConstants.ORIENTATION.NE;
					} else {
						return fmpConstants.ORIENTATION.NO;
					}
				}
			} else {
				if (deltaY == 0) {
					if (deltaX > 0) {
						return fmpConstants.ORIENTATION.NE;
					} else {
						return fmpConstants.ORIENTATION.NO;
					}
				} else {
					if (deltaX > 0) {
						return fmpConstants.ORIENTATION.SE;
					} else {
						return fmpConstants.ORIENTATION.SO;
					}
				}
			}
		}
	}

	this.areAdjacent = function(pieceOrCase1, pieceOrCase2) {
		if (pieceOrCase1.pieceType != null
			&& pieceOrCase1.pieceType.value == fmpConstants.PIECE_TYPE.BARGE.value) {
			if (pieceOrCase2.pieceType != null
				&& pieceOrCase2.pieceType.value == fmpConstants.PIECE_TYPE.BARGE.value) {
				// Les 2 pieces sont des barges
				var caseAvantBarge1Coords = this.getCoordsCaseAvantBarge(pieceOrCase1, pieceOrCase1.orientation);
				var caseAvantBarge2Coords = this.getCoordsCaseAvantBarge(pieceOrCase2, pieceOrCase2.orientation);

				return this.areCoordinatesAdjacent(pieceOrCase1.x, pieceOrCase1.y, pieceOrCase2.x, pieceOrCase2.y)
					|| this.areCoordinatesAdjacent(caseAvantBarge1Coords.x, caseAvantBarge1Coords.y, pieceOrCase2.x, pieceOrCase2.y)
					|| this.areCoordinatesAdjacent(pieceOrCase1.x, pieceOrCase1.y, caseAvantBarge2Coords.x, caseAvantBarge2Coords.y)
					|| this.areCoordinatesAdjacent(caseAvantBarge1Coords.x, caseAvantBarge1Coords.y , caseAvantBarge2Coords.x, caseAvantBarge2Coords.y);
			} else {
				// La piece1 est une barge mais pas la piece2
				var caseAvantBarge1Coords = this.getCoordsCaseAvantBarge(pieceOrCase1, pieceOrCase1.orientation);
				return this.areCoordinatesAdjacent(pieceOrCase1.x, pieceOrCase1.y, pieceOrCase2.x, pieceOrCase2.y)
					|| this.areCoordinatesAdjacent(caseAvantBarge1Coords.x, caseAvantBarge1Coords.y, pieceOrCase2.x, pieceOrCase2.y);
			}
		} else {
			if (pieceOrCase2.pieceType != null
				&& pieceOrCase2.pieceType.value == fmpConstants.PIECE_TYPE.BARGE.value) {
				// La piece2 est une barge mais pas la piece1
				var caseAvantBarge2Coords = this.getCoordsCaseAvantBarge(pieceOrCase2, pieceOrCase2.orientation);
				return this.areCoordinatesAdjacent(pieceOrCase1.x, pieceOrCase1.y, pieceOrCase2.x, pieceOrCase2.y)
					|| this.areCoordinatesAdjacent(pieceOrCase1.x, pieceOrCase1.y, caseAvantBarge2Coords.x, caseAvantBarge2Coords.y);
			} else {
				// La piece1 et la piece2 ne sont pas des barges
				return this.areCoordinatesAdjacent(pieceOrCase1.x, pieceOrCase1.y, pieceOrCase2.x, pieceOrCase2.y);
			}
		}
	}

	this.getCoordsCaseAvantBarge = function(barge) {
		return this.getCaseCoordsInOrientation(barge, barge.orientation);
	}
	this.getCaseTypeMaree = function(targetCase, maree) {
		return fmpConstants.CASE_TYPE_MAREE.filter(function(caseTypeMaree) {
				return caseTypeMaree.caseType.value == targetCase.caseType.value;
			}).filter(function(caseTypeMaree) {
				return caseTypeMaree.marees.indexOf(maree.value) > -1;
			})[0];
	}
}

// node.js ?
if (typeof module !== 'undefined' && module.exports) {
	var fmpConstants = require('./fmp-constants').fmpConstants;

	module.exports.tools = new Tools(fmpConstants);
}