// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
// const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Get information about something")
		.addSubcommand((sub) =>
			sub.setName("guild").setDescription("Information about this guild")
		)
		.addSubcommand((sub) =>
			sub
				.setName("user")
				.setDescription("Information about a user")
				.addUserOption((option) =>
					option
						.setName("target")
						.setDescription("Mention a user")
						.setRequired(false)
				)
		),
	category: "information",
	async execute(interaction) {
		const { client, guild } = interaction;

		let sub = interaction.options.getSubcommand();

		if (sub == "guild") {
			const owner = await guild.members.fetch(guild.ownerId);

			const guildChannels = guild.channels.cache;
			const guildMembers = guild.members.cache;
			// console.log(guildMembers);
			const channels = {
				voice: guildChannels.filter((c) => c.type === "GUILD_VOICE").size,
				voiceL: guildChannels.filter(
					(c) =>
						c.type === "GUILD_VOICE" &&
						!c.permissionsFor(guild.roles.everyone).has(["CONNECT"])
				).size,
				text: guildChannels.filter((c) => c.type === "GUILD_TEXT").size,
				textL: guildChannels.filter(
					(c) =>
						c.type === "GUILD_TEXT" &&
						!c.permissionsFor(guild.roles.everyone).has(["SEND_MESSAGES"])
				).size,
			};

			const members = {
				user: guildMembers.filter((m) => m.user.bot !== true).size,
				bot: guildMembers.filter((m) => m.user.bot === true).size,
			};

			const Embed = new Discord.MessageEmbed()
				.setTitle(guild.name + "'s Informations")
				.setColor("RANDOM")
				// .setDescription(timeConverter(guild.joinedTimestamp))
				.setThumbnail(guild.iconURL({ size: 1024, dynamic: true }))
				.addField("Owner", `\`\`\`${owner.user.tag}\`\`\``, true)
				// .addField("Prefix", `\`\`\`${guildSettings.prefix}\`\`\``, true)
				.addField("Roles", "```" + guild.roles.cache.size + " roles```", true)
				.addField(
					guildChannels.size + " Channels",
					`\`\`\`Texts: ${channels.text} (${channels.textL} locked)\nVoices: ${channels.voice} (${channels.voiceL} locked)\`\`\``,
					true
				)
				.addField(
					guildMembers.size + " Members",
					`\`\`\`Users: ${members.user}\nBots: ${members.bot}\`\`\``,
					true
				)
				.addField(
					"Additional",
					`\`\`\`Created at: ${timeConverter(
						guild.joinedTimestamp
					)}\nVerification Level: ${guild.verificationLevel}\nBoost Level: ${
						guild.premiumTier
					}\nBoost Count: ${
						guild.premiumSubscriptionCount
					}\nPreferred Locale: ${guild.preferredLocale}\`\`\``
				)
				.setFooter({ text: `ID: ${guild.id}` })
				.setTimestamp(guild.joinedTimestamp);

			return await interaction.reply({
				embeds: [Embed],
				ephemeral: true,
			});
		} else if (sub == "user") {
			const user = interaction.options.getUser("target") || interaction.user;

			const getUserBannerUrl = require("../../../modules/info/getUserBannerUrl");

			const guild = await client.guilds.fetch(interaction.guildId);

			const invites = await guild.invites.fetch();

			const invite = invites.size > 0 ? invites.first() : null;

			const member = await guild.members.fetch(user.id);

			const Embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setAuthor({
					name: user.tag,
				})
				.setThumbnail(user.displayAvatarURL({ dynamic: true }))
				.setDescription(
					`${
						member.avatar
							? "[Guild Avatar](" +
							  member.displayAvatarURL({ dynamic: true }) +
							  ")\n"
							: ""
					}Joined Discord since <t:${Math.round(
						user.createdTimestamp / 1000
					)}:R>\nJoined **${
						invite == null
							? guild.name
							: "[" + guild.name + "](" + invite.url + ")"
					}** since <t:${Math.round(member.joinedTimestamp / 1000)}:R>${
						member.premiumSinceTimestamp
							? "\nServer boosting since <t:" +
							  Math.round(member.premiumSinceTimestamp / 1000) +
							  ":R>"
							: ""
					}`
				)
				.setImage(await getUserBannerUrl(client, user.id));

			if (member.nickname) Embed.setTitle(member.nickname);

			const JPG = new Discord.MessageButton()
				.setStyle("LINK")
				.setLabel("JPG")
				.setURL(
					`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`
				);

			const PNG = new Discord.MessageButton()
				.setStyle("LINK")
				.setLabel("PNG")
				.setURL(
					`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
				);

			const WEBP = new Discord.MessageButton()
				.setStyle("LINK")
				.setLabel("WEBP")
				.setURL(
					`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
				);

			const ROW = new Discord.MessageActionRow().addComponents([
				WEBP,
				PNG,
				JPG,
			]);

			return await interaction.reply({
				embeds: [Embed],
				components: [ROW],
				ephemeral: interaction.user == user || user.bot,
			});
		}
	},
};

function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp);
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time =
		month + " " + date + " " + year + " " + hour + ":" + min + ":" + sec;
	return time;
}
