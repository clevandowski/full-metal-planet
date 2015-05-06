/* 
 * datas
 */
var FMPPlateauService = function(fmpConstants, fmpCaseService) {
	var _cases = [];

 	var RAW_DATAS = [
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,		
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE
		], 
		[
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE
		],
		[
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		[
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		// L16
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		// L17
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		// L18
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		// L19
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.RECIF,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		// L20
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		// L21
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		// L22
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		],
		// L23
		[
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MER,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MONTAGNE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.MARECAGE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE,
			fmpConstants.CASE_TYPE.PLAINE
		]
	];

	for (j = 0; j < RAW_DATAS.length; j++) {
		var line = RAW_DATAS[j];
		_cases[j] = [];
		for (i = 0; i < line.length; i++) {
			var caseType = line[i];
			_cases[j][i] = fmpCaseService.createCase(caseType, i, j);
		}
	}

	this.getPlateau = function() {
		return _cases;
	}
}

// node.js ?
if (typeof module !== 'undefined' && module.exports) {
	var fmpConstants = require('./fmp-constants').fmpConstants;
	var fmpCaseService = require('./case').fmpCaseService;

	module.exports.getPlateau = new FMPPlateauService(fmpConstants, fmpCaseService).getPlateau;
}