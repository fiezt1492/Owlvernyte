const { prefix } = require("./../../config");
const {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
	MessageButton,
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

		if (!args.length) {
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
				.addField(
					"CONNECT WITH US",
					"**[Youtube](https://www.youtube.com/channel/UCEG5sgFKieaUuHsu5VG-kBg)** | **[Discord](https://discord.io/owlvernyte+)** | **[Facebook](https://www.facebook.com/owlvernyte)**"
				)
				.addField(
					"Buy me a coffee",
					`**[Playerduo](https://playerduo.com/owlvernyte)** | **[buymeacoffee](https://buymeacoffee.com/fiezt)**`
				)
				.setFooter(`Select one of these categories below`);

			const components = (state) => [
				new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId("helpPanel")
						.setPlaceholder("Please select a category")
						.setDisabled(state)
						.addOptions({
							label: "Home",
							value: "home",
							description: "Showing homepage",
						})
						.addOptions(
							commandsList.map((cmd) => {
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
				new MessageActionRow().addComponents(
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://top.gg/bot/853623967180259369/invite")
						.setLabel("Invite me"),
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://top.gg/bot/853623967180259369/vote")
						.setLabel("Vote me"),
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://discord.io/owlvernyte")
						.setLabel("Support Server")
				),
			];

			const msg = await message.channel.send({
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
				if (interaction.values.includes("home"))
					return interaction.update({ embeds: [helpEmbed] });
				const [category] = interaction.values;
				const list = commandsList.find(
					(x) => x.category.toLowerCase() === category
				);

				const categoryEmbed = new MessageEmbed()
					.setTitle(`Help Panel`)
					.setColor("RANDOM")
					.setURL(process.env.URL)
					.setDescription(
						`You can use \`${prefix}help <command name>\` to get info on a specific command!`
					)
					.addField(
						list.category.toUpperCase(),
						"`" + list.commands.map((cmd) => cmd.name).join("`, `") + "`"
					);
				msgCol.resetTimer()
				interaction.update({ embeds: [categoryEmbed] });
			});

			msgCol.on("end", () => {
				msg.edit({ components: components(true) });
			});
		} else {

			const command =
				commands.get(args.join(" ").toLowerCase()) ||
				commands.find(
					(c) => c.aliases && c.aliases.includes(args.join(" ").toLowerCase())
				);

			if (!command) {
				return message.reply({ content: "That's not a valid command!" });
			}

			let commandEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setDescription(
					`Find information on the command provided.\nMandatory arguments \`[]\`, optional arguments \`<>\`.`
				)
				.setTitle(command.name);

			if (command.description)
				commandEmbed.addField("Description", `${command.description}`);

			if (command.aliases && command.aliases.length > 0)
				commandEmbed
					.addField("Aliases", `\`${command.aliases.join(", ")}\``, true)
					.addField("Cooldown", `${command.cooldown || 3} second(s)`, true);
			if (command.usage)
				commandEmbed.addField(
					"Usage",
					`\`${prefix}${command.name} ${command.usage}\``,
					true
				);
			else commandEmbed.addField(
				"Usage",
				`\`${prefix}${command.name}\``,
				true
			);

			return message.reply({ embeds: [commandEmbed] });
		}
	},
};
