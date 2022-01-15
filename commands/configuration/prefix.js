const Discord = require("discord.js");
const config = require("../../config");

module.exports = {
	name: "prefix",
	description: "Change server prefix",
	category: "configuration",
	aliases: [],
	usage: "[options]",
	cooldown: 5,
	options: ["reset", "set", "get"],
	args: true,
	ownerOnly: false,
	guildOwner: true,
	permissions: ["ADMINISTRATOR"],
	guildOnly: true,

	async execute(message, args) {
		const { client } = message;
		let option = String(args[0]);
		switch (option) {
			case "set":
				args.shift();
				if (!args.length || !args[0])
					return message.reply(`Missing prefix to \`set\`.`);
				if (args[0].length > 5)
					return message.reply(
						`Prefix length limitation is **5**. Please make it shorter.`
					);
				try {
					const gDB = client.db.collection("guildSettings");
					await gDB.updateOne(
						{
							gID: message.guild.id,
						},
						{
							$set: {
								gID: message.guild.id,
								prefix: args[0],
							},
						},
						{
							upsert: true,
						}
					);
					return message.reply(
						`Your guild prefix has been set to \`${args[0].toLowerCase()}\``
					);
				} catch (error) {
					console.log(error);
					return message.reply(`**[ERROR]** ${error.message}`);
				}
			case "get":
				return message.reply(
					`Your current guild prefix is \`${
						client.guildSettings.get(message.guild.id).prefix
					}\``
				);
			case "reset":
				try {
					const gDB = client.db.collection("guildSettings");
					await gDB.updateOne(
						{
							gID: message.guild.id,
						},
						{
							$unset: {
								prefix: 1,
							},
						},
						{
							upsert: true,
						}
					);
					return message.reply(
						`Your guild prefix has been reset to \`${config.prefix.toLowerCase()}\``
					);
				} catch (error) {
					console.log(error);
					return message.reply(`**[ERROR]** ${error.message}`);
				}
			default:
				return message.reply(
					`**[ERROR]** Invalid \`${option}\` option.\nType \`${
						client.guildSettings.get(message.guild.id).prefix
					}${this.name}\` to know how to use this.`
				);
		}
	},
};
