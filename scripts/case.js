/*
 * @Import(constant.js)
 */
var FMPCaseService = function() {
	this.createCase = function(caseType, x, y) {
		return ({
			caseType: caseType,
			x: x,
			y: y
		});
	}
}

// node.js ?
if (typeof module !== 'undefined' && module.exports) {
	module.exports.fmpCaseService = new FMPCaseService();
}
