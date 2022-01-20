const { Collection } = require("discord.js");
const { prefix, owner } = require("../config");

module.exports = {
	name: "interactionCreate",

	async execute(interaction) {
		const { client } = interaction;

		if (!interaction.isCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);

		if (!command) return;

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
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return interaction.reply({
					content: `Please wait **${timeLeft.toFixed(
						1
					)}** more second(s) before reusing the \`${command.name}\` command.`,
					ephemeral: true
				});
			}
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "There was an issue while executing that command!",
				ephemeral: true,
			});
		}
	},
};
