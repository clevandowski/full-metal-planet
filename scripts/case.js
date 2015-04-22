/*
 * @Import(constant.js)
 */
var FMPCase = function(caseType, x, y) {
	this.caseType = caseType;
	this.x = x;
	this.y = y;

	this.getCaseTypeMaree = function(maree) {
		return CASE_TYPE_MAREE.filter(function(caseTypeMaree) {
				return caseTypeMaree.caseType == caseType;
			}).filter(function(caseTypeMaree) {
				return caseTypeMaree.marees.indexOf(maree.value) > -1;
			})[0];
	}
}
