// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { millify } = require("millify");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("daily")
		.setDescription("Get your daily reward"),
	category: "economy",
	mongoCD: 24 * 60 * 60,
	once: true,
	async execute(interaction, Player, ONCE, i18n) {
		const { client } = interaction;

		const mongoCD = await Player.cooldownsGet(this.data.name);
		if (mongoCD) {
			if (Date.now() - mongoCD.timestamps < mongoCD.duration) {
				return interaction.reply({
					content: `You can use \`${this.data.name}\` command <t:${Math.floor(
						(mongoCD.timestamps + mongoCD.duration) / 1000
					)}:R>`,
					ephemeral: true,
				});
			} else await Player.cooldownsPull(this.data.name);
		}

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("GET YOUR DAILY REWARD BY CLICK ON THE ABOVE BUTTON!");

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("dailyreward")
					.setDisabled(state)
					.setLabel("REWARD")
					.setStyle("SUCCESS")
			),
		];

		await interaction.reply({
			embeds: [Embed],
			components: components(false),
			ephemeral: true,
		});

		const msg = await interaction.fetchReply();

		ONCE.set(interaction.user.id, {
			name: this.data.name,
			gID: msg.guild.id,
			cID: msg.channel.id,
			mID: msg.id,
			mURL: msg.url,
		});

		const filter = (i) => i.user.id === interaction.user.id;

		const msgCol = msg.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 60000,
		});

		msgCol.on("collect", () => {
			msgCol.stop();
		});

		msgCol.on("end", async (collected, reason) => {
			ONCE.delete(interaction.user.id);
			if (reason === "time") {
				Embed.color = "RED";
				return interaction.editReply({
					embeds: [Embed],
					components: components(true),
				});
			}

			const chance = Math.round(Math.random() * 99) + 1;
			let random;
			if (chance < 1) random = Math.round(Math.random() * 9999) + 1;
			else random = Math.round(Math.random() * 999) + 1;
			// console.log(random);
			const string = millify(random);
			await Player.cooldownsPush(this.name, 24 * 60 * 60 * 1000);
			await Player.owlet(random);
			Embed.title = "SUCCESS!";
			Embed.color = "GREEN";
			Embed.setDescription(`You received \`${string}\` owlets!`);

			if (collected)
				return collected.map(async (btn) => {
					if (btn.replied === false)
						await btn.update({
							embeds: [Embed],
							components: components(true),
						});
				});
		});
	},
};
