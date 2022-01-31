// const { prefix } = require("../config.js");
const guildPrefix = require("../modules/configuration/guildPrefix")

module.exports = {
	async execute(message, i18n) {
		let prefix = guildPrefix.get(message)
		// return message.reply(
		// 	`This guild prefix is \`${prefix}\`. Type \`${prefix}help\` to spawn help panel.`
		// );
		return message.reply(i18n.__mf("onMention.reply", {prefix: prefix}));

	},
};
