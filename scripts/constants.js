/*
 * constants
 */

var PLATEAU_WIDTH = 37;
var PLATEAU_HEIGHT = 23;
/* 
 * enums & static arrays
 */
var MAREES = [
	{ value: 'B', name: 'Basse'},
	{ value: 'N', name: 'Normale'},
	{ value: 'H', name: 'Haute'} 
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

var PLAYER_ACTION_TYPE = {
	SELECT: { name: 'sélection' },
	// SELECT_SOUTE: { name: 'select-soute' },
	MOVE: { name: 'déplacement'},
	LOAD: { name: 'chargement'},
	UNLOAD: { name: 'déchargement'},
	ATTACK: { name: 'attaque'},
	END_OF_TURN: { name: 'fin du tour' }
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

var REFEREE_RUNTIME_MODE = {
	LOCAL: 'local',
	REMOTE: 'remote'
}