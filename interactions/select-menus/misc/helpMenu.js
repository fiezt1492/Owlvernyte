const { prefix } = require("../../../config");

const { MessageEmbed } = require("discord.js");

module.exports = {
	id: "helpMenu",
	filter: "author",
	// time: 60000,

	async execute(interaction) {
		const { message } = interaction;

		const { commands } = message.client;

		// console.log(interaction);

		const formatString = (str) =>
			`${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

		const categories = [...new Set(commands.map((cmd) => cmd.category))];

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

		// const filter = (interaction) => interaction.user.id === message.author.id;

		// const msgCol = message.channel.createMessageComponentCollector({
		// 	filter,
		// 	componentType: "SELECT_MENU",
		// 	time: 60000,
		// });

		// msgCol.on("collect", (interaction) => {
		// 	// console.log(interaction.values)
		const [category] = interaction.values;
		const list = commandsList.find(
			(x) => x.category.toLowerCase() === category
		);

		// 	// console.log(list)

		const categoryEmbed = new MessageEmbed()
			.setTitle(`${category.toUpperCase()}`)
			.setDescription(
				`You can use \`${prefix}help <command name>\` to get info on a specific command!`
			)
			.addField(
				list.category,
				"`" + list.commands.map((cmd) => cmd.name).join("`, `") + "`"
			);

		interaction.update({ embeds: [categoryEmbed] });
		// });

		// msgCol.on("end", () => {
		// 	message.edit({ components: components(true) });
		// });

		// await interaction.reply({
		// 	content: "This was a reply from select menu handler!",
		// });
		// return;
	},
};
