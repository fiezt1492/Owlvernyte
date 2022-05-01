// Deconstructed the constants we need in this file.

const {
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	MessageSelectMenu,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// const { prefix } = require("../../../config");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription(
			"List all commands of bot or info about a specific command."
		)
		.addStringOption((option) =>
			option
				.setName("topic")
				.setDescription("Select a topic")
				.setRequired(true)
				.addChoice("Get command list", "commands")
				.addChoice("Get relevant links", "links")
				.addChoice("Support server", "support")
		),
	category: "information",
	// once: true,

	async execute(interaction, Player, ONCE, i18n) {
		const { client } = interaction;
		const { commands } = client;
		// const slashCommands = client.slashCommands;
		const topic = interaction.options.getString("topic");

		if (topic == "commands") {
			let categories = [...new Set(commands.map((cmd) => cmd.category))];

			categories = categories.filter((cate) => cate !== "private");

			const commandsList = categories.map((cate) => {
				const getCommands = commands
					.filter((cmd) => cmd.category === cate)
					.map((cmd) => {
						return {
							name: cmd.data.name || null,
							description: cmd.data.description || null,
						};
					});

				return {
					category: cate,
					commands: getCommands,
				};
			});

			let helpEmbed = new MessageEmbed()
				.setColor("RANDOM")
				.setURL(process.env.URL)
				.setTitle(i18n.__("help.helpEmbed.title"))
				// .setDescription(
				// 	i18n.__mf("help.helpEmbed.description", {
				// 		prefix: prefix,
				// 	})
				// )
				.addField(
					i18n.__("help.helpEmbed.field0.title"),
					"**[Youtube](https://www.youtube.com/channel/UCEG5sgFKieaUuHsu5VG-kBg)** | **[Discord](https://discord.io/owlvernyte+)** | **[Facebook](https://www.facebook.com/owlvernyte)**"
				)
				.addField(
					i18n.__("help.helpEmbed.field1.title"),
					`**[Playerduo](https://playerduo.com/owlvernyte)** | **[buymeacoffee](https://buymeacoffee.com/fiezt)**`
				)
				.setFooter({ text: `Select one of these categories below` });

			const components = (state) => [
				new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId("helpPanel")
						.setPlaceholder(i18n.__("help.components.placeholder"))
						.setDisabled(state)
						.addOptions({
							label: i18n.__("help.components.home.label"),
							value: "home",
							description: i18n.__("help.components.home.description"),
						})
						.addOptions(
							commandsList.map((cmd) => {
								return {
									label: cmd.category.toUpperCase(),
									value: cmd.category.toLowerCase(),
									description: i18n.__mf(
										"help.components.category.description",
										{ category: cmd.category.toUpperCase() }
									),
								};
							})
						)
				),
				new MessageActionRow().addComponents(
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://top.gg/bot/853623967180259369/invite")
						.setLabel(i18n.__("help.components.invite")),
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://top.gg/bot/853623967180259369/vote")
						.setLabel(i18n.__("help.components.vote")),
					new MessageButton()
						.setStyle("LINK")
						.setURL("https://discord.io/owlvernyte")
						.setLabel(i18n.__("help.components.supportserver"))
				),
			];

			// Replies to the interaction!

			await interaction.reply({
				embeds: [helpEmbed],
				components: components(false),
				ephemeral: true,
			});

			const msg = await interaction.fetchReply();
			// console.log(msg)

			// ONCE.set(interaction.user.id, {
			// 	name: this.data.name,
			// 	gID: msg.guild.id,
			// 	cID: msg.channel.id,
			// 	mID: msg.id,
			// 	mURL: msg.url,
			// });

			const msgCol = msg.createMessageComponentCollector({
				componentType: "SELECT_MENU",
				time: 60000,
			});

			msgCol.on("collect", () => {
				msgCol.resetTimer();
			});

			msgCol.on("end", async () => {
				await interaction.editReply({ components: components(true) });
				// ONCE.delete(interaction.user.id);
			});
		} else if (topic == "links") {
			let components = new MessageActionRow().addComponents(
				new MessageButton()
					.setLabel("Invite link (Unrestricted)")
					.setStyle("LINK")
					.setURL(
						`https://discord.com/api/oauth2/authorize?client_id=853623967180259369&permissions=8&scope=applications.commands%20bot`
					),
				new MessageButton()
					.setLabel("Invite link (Restricted)")
					.setStyle("LINK")
					.setURL(
						`https://discord.com/api/oauth2/authorize?client_id=874183713020330015&permissions=137976155200&scope=applications.commands%20bot`
					),
				new MessageButton()
					.setLabel("Vote")
					.setStyle("LINK")
					.setURL(`https://top.gg/bot/853623967180259369/vote`)
			);

			// safe invite https://discord.com/api/oauth2/authorize?client_id=874183713020330015&permissions=137976155200&scope=applications.commands%20bot

			if (interaction.guild.id === "830110554604961824")
				components.addComponents(
					new MessageButton()
						.setLabel("Vote this server")
						.setStyle("LINK")
						.setURL(`https://top.gg/servers/830110554604961824/vote`)
				);

			return await interaction.reply({
				content: `Here you go.`,
				components: [components],
				ephemeral: true,
			});
		} else if (topic == "support") {
			return await interaction.reply({
				content: `https://discord.gg/F7ZK6ssMUm`,
				ephemeral: true,
			});
		}
	},
};
