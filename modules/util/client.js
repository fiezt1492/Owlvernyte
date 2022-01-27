const Players = require("../economy/players")

module.exports = (client) => {
	client.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	client.number = (input) =>
		input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	client.getUserFromMention = (args) => {
		var mention, id, matches;
		args.forEach((element, index) => {
			if (index > 0 && id) return;
			matches = element.match(/^<@!?(\d+)>$/);
			if (!matches) return;
			return (id = matches[1]);
		});
		if (!id) return;
		return client.users.fetch(id);
	};
	client.bal = async (id) => {
		const Player = new Players(id)
		const player = await Player.get()
		if (!player) return null
		const bal = {
			owlet: player.owlet,
			nyteGem: player.nyteGem,
			bank: player.bank
		}
		return bal
	}
};
