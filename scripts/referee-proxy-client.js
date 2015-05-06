var RefereeProxyClient = function(fmpConstants, $http, partie, tools) {

	this.validatePlayerAction = function(playerAction, callback) {
		// Actions globales En mode multiplayer
		// In progress
		var httpRequest = {
			method: 'POST',
			// Nécessite un reverse proxy
			// cf /etc/apache2/sites-enabled/000-default.conf
			url: '/full-metal-planet-server/validate',
			// headers: {
			// 	Origin: 'http://cyrille-zenika/full-metal-planet/'
			// },
			// data: {id: 0, name: partie.getPlayer().name}
			data: playerAction
		}
		console.log('playerAction sent: ' + JSON.stringify(playerAction));

		$http(httpRequest)
			.success(function(data, status, headers, config) {
				var actionReport = data;
				console.log('actionReport received: ' + JSON.stringify(actionReport));
				callback(playerAction, actionReport);
				return;
			})
			.error(function(data, status, headers, config) {
				console.log('error: HttpResponse.status: ' + JSON.stringify(status));
				console.log('error: HttpResponse.data: ' + JSON.stringify(data));
				console.log('error: HttpResponse.headers: ' + JSON.stringify(headers));
				console.log('error: HttpResponse.config: ' + JSON.stringify(config));
				actionReport = {
					status: false,
					errorMessages: ['Erreur lors de l\'appel au serveur', 'Regardez les logs dans la console']
				}
				callback(playerAction, actionReport);
				return;
			});
	}
}