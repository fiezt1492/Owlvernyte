const Discord = require("discord.js");

module.exports = {
	name: "backpack",
	description: "Get SO backpack",
	category: "player",
	aliases: ["inventory", "inv"],
	usage: "<@user>",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE) {
		const { client } = message;
		const user = message.mentions.users.first() || message.author
		const db = client.db.collection("backpacks")
		const backpack = await db.findOne({
			id: user.id
		},{
			projection: {
          _id: 0
        }
		})
		console.log(backpack)
	},
};
