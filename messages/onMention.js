// const { prefix } = require("../config.js");
const guildPrefix = require("../modules/configuration/guildPrefix")

module.exports = {
	async execute(message) {
		let prefix = guildPrefix.get(message)
		return message.reply(
			`This guild prefix is \`${prefix}\`. Type \`${prefix}help\` to spawn help panel.`
		);
	},
};
