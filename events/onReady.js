const { prefix } = require("../config")

module.exports = {
	name: "ready",
	once: true,

	execute(client) {

		// client.user.setPresence({})

		console.log(`Ready! Logged in as ${client.user.tag}`);

	},
};
