/*
 * constants
 */
var FMPConstants = function() {
	console.log('new Constants !');
	this.PLATEAU_WIDTH = 37;
	this.PLATEAU_HEIGHT = 23;

	this.MAREES = [
		{ value: 'B', name: 'Basse'},
		{ value: 'N', name: 'Normale'},
		{ value: 'H', name: 'Haute'} 
	];

	this.CASE_TYPE = {
		PLAINE: { value: 'PLAINE', name: 'plaine' },
		MONTAGNE: { value: 'MONTAGNE', name: 'montagne' },
		MARECAGE: { value: 'MARECAGE', name: 'marecage' },
		RECIF: { value: 'RECIF', name: 'recif' },
		MER: { value: 'MER', name: 'mer' }
	};

	this.CASE_TYPE_MAREE = [
		{ value: 'PLAINE', name: 'plaine', cssName: 'plaine', caseType: this.CASE_TYPE.PLAINE, marees: [ 'B', 'N', 'H' ], modeDeplacement: 'terrestre' },
		{ value: 'MONTAGNE', name: 'montagne', cssName: 'montagne', caseType: this.CASE_TYPE.MONTAGNE, marees: [ 'B', 'N', 'H' ], modeDeplacement: 'terrestre' },
		{ value: 'MARECAGE_SEC', name: 'marecage-sec', cssName: 'marecage-sec', caseType: this.CASE_TYPE.MARECAGE, marees: [ 'B', 'N' ], modeDeplacement: 'terrestre' },
		{ value: 'MARECAGE_INONDE', name: 'marecage-inonde', cssName: 'marecage-inonde', caseType: this.CASE_TYPE.MARECAGE, marees: [ 'H' ], modeDeplacement: 'maritime' },
		{ value: 'RECIF_SEC', name: 'recif-sec', cssName: 'recif-sec', caseType: this.CASE_TYPE.RECIF, marees: [ 'B' ], modeDeplacement: 'terrestre' },
		{ value: 'RECIF_INONDE', name: 'recif-inonde', cssName: 'recif-inonde', caseType: this.CASE_TYPE.RECIF, marees: [ 'N', 'H' ], modeDeplacement: 'maritime' },
		{ value: 'MER', name: 'mer', cssName: 'mer', caseType: this.CASE_TYPE.MER, marees: [ 'B', 'N', 'H' ], modeDeplacement: 'maritime' }
	];

	// encombrement = nb de place prise sur un crabe ou une barge
	this.PIECE_TYPE = {
		MUNITION: { value: 'MUNITION', name: 'munition', cssName: 'munition', mobile: false, modeDeplacement: 'none', encombrement: 1, transporter: false, transportCapacite: -1, destroyer: false, attackRange: -1},
		TANK: { value: 'TANK', name: 'tank', cssName: 'tank', mobile: true, modeDeplacement: 'terrestre', encombrement: 1, transporter: false, transportCapacite: -1, destroyer: true, attackRange: 2 },
		BARGE: { value: 'BARGE', name: 'barge', cssName: 'barge', mobile: true, modeDeplacement: 'maritime', encombrement: 4, transporter: true, transportCapacite: 4, destroyer: false, attackRange: -1 },
		AERONEF_CORE: { value: 'AERONEF_CORE', name: 'base centrale', cssName: 'aeronef-core', mobile: false, modeDeplacement: 'none', encombrement: 10, transporter: true, transportCapacite: 99, destroyer: false, attackRange: -1 },
		AERONEF_TURRET: { value: 'AERONEF_TURRET', name: 'tourelle', cssName: 'aeronef-turret', mobile: false, modeDeplacement: 'none', encombrement: 10, transporter: true, transportCapacite: 4, destroyer: true, attackRange: 2 }
	}

	this.ORIENTATION = {
		N: { value: 'N', name: 'nord', cssName: 'orientation-nord', next: 'NE', previous: 'NO' },
		NE: { value: 'NE', name: 'nord-est', cssName: 'orientation-nord-est', next: 'SE', previous: 'N' },
		SE: { value: 'SE', name: 'sud-est', cssName: 'orientation-sud-est', next: 'S', previous: 'NE' },
		S: { value: 'S', name: 'sud', cssName: 'orientation-sud', next: 'SO', previous: 'SE' },
		SO: { value: 'SO', name: 'sud-ouest', cssName: 'orientation-sud-ouest', next: 'NO', previous: 'S' },
		NO: { value: 'NO', name: 'nord-ouest', cssName: 'orientation-nord-ouest', next: 'N', previous: 'SO' }
	}

	this.PLAYER_ACTION_TYPE = {
		SELECT: { value: 'SELECT', name: 'sélection' },
		// SELECT_SOUTE: { name: 'select-soute' },
		MOVE: { value: 'MOVE', name: 'déplacement'},
		LOAD: { value: 'LOAD', name: 'chargement'},
		UNLOAD: { value: 'UNLOAD', name: 'déchargement'},
		ATTACK: { value: 'ATTACK', name: 'attaque'},
		END_OF_TURN: { value: 'END_OF_TURN', name: 'fin du tour' }
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
	this.ZONE_VERIFICATION_MENACE_TIR = [
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

	this.REFEREE_RUNTIME_MODE = {
		LOCAL: 'local',
		REMOTE: 'remote',
		SERVER: 'server'
	}
};

FMPConstants.getConstants = function() {
	return new FMPConstants();
};

// node.js ?
if (typeof module !== 'undefined' && module.exports) {
	module.exports.fmpConstants = FMPConstants.getConstants();
}