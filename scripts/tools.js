var Tools = function() {
	/*
	 * @UtilService
	 */
	this._areCoordinatesInRadius = function(x0, y0, x1, y1, radius) {
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
		return this._areCoordinatesInRadius(x0, y0, x1, y1, 1);
	}

	/*
	 * @UtilService
	 * @return Un objet { x, y } des coordonnées cible
	 */
	this.getCaseCoordsInOrientation = function(startCase, orientation) {
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
}