// Declares constants (destructured) to be used in this file.

const { Collection } = require("discord.js");
const { prefix, owner } = require("../config");

// Prefix regex, we will use to match in mention prefix.

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
	name: "messageCreate",

	async execute(message) {
		// Declares const to be used.

		const { client, guild, channel, content, author } = message;

		// Checks if the bot is mentioned in the message all alone and triggers onMention trigger.
		// You can change the behavior as per your liking at ./messages/onMention.js

		if (
			message.content == `<@${client.user.id}>` ||
			message.content == `<@!${client.user.id}>`
		) {
			require("../messages/onMention").execute(message);
			return;
		}

		// const gDB = client.db.collection("guildSettings");
		// const guildSetting = await gDB.findOne(
		// 	{ gID: message.guild.id },
		// 	{
		// 		prefix: 1,
		// 	}
		// );

		// if (guildSetting && guildSetting.prefix) {
		// 	client.guildSettings.set(message.guild.id, {
		// 		prefix: guildSetting.prefix,
		// 	});
		// } else {
		// 	client.guildSettings.set(message.guild.id, {
		// 		prefix: prefix,
		// 	});
		// }

		const checkPrefix = (
			await require("../modules/configuration/guildPrefix").get(message)
		).toLowerCase();

		const prefixRegex = new RegExp(
			`^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)})\\s*`
		);

		// Checks if message content in lower case starts with bot's mention.

		if (!prefixRegex.test(content.toLowerCase())) return;

		const [matchedPrefix] = content.toLowerCase().match(prefixRegex);

		const args = content.slice(matchedPrefix.length).trim().split(/ +/);

		const commandName = args.shift().toLowerCase();

		// Check if mesage does not starts with prefix, or message author is bot. If yes, return.

		if (!message.content.startsWith(matchedPrefix) || message.author.bot)
			return;

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		// It it's not a command, return :)

		if (!command) return;

		// Owner Only Property, add in your command properties if true.

		if (command.ownerOnly && message.author.id !== owner) {
			return;
		}

		// Guild Only Property, add in your command properties if true.

		if (command.guildOnly && message.channel.type === "dm") {
			return message.reply({
				content: "I can't execute that command inside DMs!",
			});
		}

		if (command.maintain) {
			return message.reply({
				content: "This command is currently under maintenance. Please wait until we completely fixed it.",
			});
		}

		// Author perms property

		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply({ content: "You can not do this!" });
			}
		}

		if (command.guildOwner === true) {
			if (author.id !== guild.ownerId)
				return message.reply("This command is only for guild owner.");
		}

		// Args missing

		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			if (command.options && command.options.length > 0) {
				let options = command.options
					.map((o) => `${prefix}${command.name} ${o.toLowerCase()}`)
					.join("\n");

				reply += `\n\`\`\`Usage:\n${options}\`\`\``;
			}

			return message.reply({ content: reply });
		} 
		// else if (
		// 	command.args &&
		// 	args.length &&
		// 	command.options &&
		// 	command.options.length > 0
		// ) {
		// 	let options = command.options
		// 		.map((o) => `${prefix}${command.name} ${o.toLowerCase()}`)
		// 		.join("\n");
		// 	let reply = `Wrong input option.\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\`\n\`\`\`Usage:\n${options}\`\`\``;
		// 	if (!command.options.includes(args[0]))
		// 		return message.reply({ content: reply });
		// }

		// Cooldowns

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply({
					content: `Please wait **${timeLeft.toFixed(
						1
					)}** more second(s) before reusing the \`${command.name}\` command.`,
				});
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Rest your creativity is below.

		// execute the final command. Put everything above this.
		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply({
				content: "There was an error trying to execute that command!",
			});
		}
	},
};
