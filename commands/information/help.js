// Deconstructing prefix from config file to use in help command
const { prefix } = require("./../../config");

// Deconstructing MessageEmbed to create embeds within this command
const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} = require("discord.js");

module.exports = {
	name: "help",
	description: "List all commands of bot or info about a specific command.",
	aliases: ["commands"],
	category: "information",
	usage: "<command name>",
	cooldown: 5,

	async execute(message, args) {
		const { commands } = message.client;

		// If there are no args, it means it needs whole help command.

		if (!args.length) {
			// console.log(commands)
			const formatString = (str) =>
				`${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

			let categories = [...new Set(commands.map((cmd) => cmd.category))];

			categories = categories.filter((cate) => cate !== "misc");

			const commandsList = categories.map((cate) => {
				const getCommands = commands
					.filter((cmd) => cmd.category === cate)
					.map((cmd) => {
						return {
							name: cmd.name || "None",
							aliases: cmd.aliases || "None",
							description: cmd.description || "None",
							usage: cmd.usage || "None",
						};
					});

				return {
					category: formatString(cate),
					commands: getCommands,
				};
			});

			let helpEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setURL(process.env.URL)
				.setTitle("Help Panel")
				.setDescription(
					`You can use \`${prefix}help <command name>\` to get info on a specific command!`
				)
				.addField("SELECTION", "Select one of these categories below");

			// commandsList.forEach((list) => {
			// 	helpEmbed.addField(list.category,"`" + list.commands.map((cmd) => cmd.name).join("`, `") + "`")
			// });

			const components = (state) => [
				new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId("helpPanel")
						.setPlaceholder("Please select a category")
						.setDisabled(state)
						.addOptions(
							commandsList.map((cmd) => {
								// if (cmd.category !== "misc")
								return {
									label: cmd.category,
									value: cmd.category.toLowerCase(),
									description: `Get commands from ${formatString(
										cmd.category
									)} category`,
								};
							})
						)
				),
			];

			// Attempts to send embed in DMs.

			const msg = await message.reply({
				embeds: [helpEmbed],
				components: components(false),
			});

			const filter = (interaction) => interaction.user.id === message.author.id;

			const msgCol = message.channel.createMessageComponentCollector({
				filter,
				componentType: "SELECT_MENU",
				time: 60000,
			});

			msgCol.on("collect", (interaction) => {
				// console.log(interaction.values)
				const [category] = interaction.values;
				const list = commandsList.find(
					(x) => x.category.toLowerCase() === category
				);

				// console.log(list)

				const categoryEmbed = new MessageEmbed()
					.setTitle(`${category.toUpperCase()}`)
					.setColor("RANDOM")
					.setDescription(
						`You can use \`${prefix}help <command name>\` to get info on a specific command!`
					)
					.addField(
						list.category,
						"`" + list.commands.map((cmd) => cmd.name).join("`, `") + "`"
					);
<<<<<<< HEAD:commands/information/help.js
=======

				interaction.update({ embeds: [categoryEmbed] });
			});

			msgCol.on("end", () => {
				msg.edit({ components: components(true) });
			});
>>>>>>> c544fb6cf4218787e058515e263b2a20e4536f6b:commands/misc/help.js

				interaction.update({ embeds: [categoryEmbed] });
			});

			msgCol.on("end", () => {
				msg.edit({ components: components(true) });
			});
		} else {
			// If argument is provided, check if it's a command.

			// let name;
			// if (args) name = args[0].toLowerCase();

			const command =
				commands.get(args.join(" ").toLowerCase()) ||
				commands.find(
					(c) => c.aliases && c.aliases.includes(args.join(" ").toLowerCase())
				);

			// If it's an invalid command.

			if (!command) {
				return message.reply({ content: "That's not a valid command!" });
			}

			let commandEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setDescription(
					`Find information on the command provided.\nMandatory arguments \`[]\`, optional arguments \`<>\`.`
				)
				.setTitle("Help Panel");

			if (command.description)
				commandEmbed.addField("Description", `${command.description}`);

			if (command.aliases)
				commandEmbed
					.addField("Aliases", `\`${command.aliases.join(", ")}\``, true)
					.addField("Cooldown", `${command.cooldown || 3} second(s)`, true);
			if (command.usage)
				commandEmbed.addField(
					"Usage",
					`\`${prefix}${command.name} ${command.usage}\``,
					true
				);

			// Finally send the embed.

			return message.reply({ embeds: [commandEmbed] });
		}
	},
};
