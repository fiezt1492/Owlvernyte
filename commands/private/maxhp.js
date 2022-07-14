const Discord = require("discord.js");

module.exports = {
	name: "maxhp",
	description: "change max hp",
	category: "",
	aliases: ["adminmaxhp"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: true,
	once: false,
	mentions: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE, i18n, mentions) {
		const { client } = message;
    const value = Number(args.shift()) || 100
    // const maxHp = await client.admin.getMaxHp()

    // console.log(maxHp)

    await client.admin.setMaxHp(value)
		client.maxHp = value

	},
};