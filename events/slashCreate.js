// const { Collection } = require("discord.js");
const Discord = require("discord.js")
const { prefix, owner } = require("../config");
const Players = require("../modules/economy/players");
const ONCE = new Map();

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);

		if (!command) return;

		if (command.once === true) {
			if (ONCE.has(interaction.user.id)) {
				const commandOnce = ONCE.get(interaction.user.id);

				const onceEmbed = new Discord.MessageEmbed()
					.setTitle("ERROR")
					.setColor("RED")
					.setDescription(
						`You need to finish your previous \`${commandOnce.name}\` command first!`
					);

				return interaction.reply({
					// content: `**[Error]** You need to finish your previous \`${command.name}\` command first!`,
					embeds: [onceEmbed],
					components: [
						{
							type: 1,
							components: [
								{
									type: 2,
									style: 5,
									label: `Forward to "${commandOnce.name}" command`,
									// url: `https://discord.com/channels/${already.gID}/${already.cID}/${already.mID}`
									url: commandOnce.mURL,
								},
							],
						},
					],
					ephemeral: true
				});
			}
		}

		if (command.permissions) {
			// console.log(interaction)
			// const guild = await client.guilds.fetch(interaction.guildId);
			// const channel = await guild.channels.fetch(interaction.channelId);
			// const authorPerms = channel.permissionsFor(interaction.member);

			// if (!authorPerms || !authorPerms.has(command.permissions))
			if (!interaction.member.permissions.has(command.permissions)) {
				return interaction.reply({
					content: "You can not do this!",
					ephemeral: true,
				});
			}
		}

		if (command.guildOwner === true) {
			if (interaction.user.id !== interaction.member.guild.ownerId)
				return interaction.reply({
					content: "This command is only for guild owner.",
					ephemeral: true,
				});
		}

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime =
				timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return interaction.reply({
					content: `Please wait **${timeLeft.toFixed(
						1
					)}** more second(s) before reusing the \`${command.name}\` command.`,
					ephemeral: true,
				});
			}
		}

		try {
			const Player = new Players(interaction.user.id);
			const playersCategories = ["economy", "gambling"];

			if (command.category && playersCategories.includes(command.category)) {
				await Player.set();
			}

			if (command.mongoCD && command.mongoCD > 0) {
				const mongoCD = await Player.cooldownsGet(command.name);
				if (mongoCD) {
					if (Date.now() - mongoCD.timestamps < mongoCD.duration) {
						return interaction.reply({
							content: `You can use \`${command.name}\` command <t:${Math.floor(
								(mongoCD.timestamps + mongoCD.duration) / 1000
							)}:R>`,
							ephemeral: true,
						});
					} else await Player.cooldownsPull(command.name);
				} else await Player.cooldownsPush(command.name, command.mongoCD * 1000);
			}

			await command.execute(interaction, Player, ONCE);
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "There was an issue while executing that command!",
				ephemeral: true,
			});
		}
	},
};
