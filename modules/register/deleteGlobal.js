const { token, client_id, test_guild_id } = require("../../config.js");

const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: "9" }).setToken(token);
rest.get(Routes.applicationCommands(client_id, test_guild_id)).then((data) => {
	const promises = [];
	for (const command of data) {
		const deleteUrl = `${Routes.applicationCommands(
			client_id,
			test_guild_id
		)}/${command.id}`;
		promises.push(rest.delete(deleteUrl));
	}
	return Promise.all(promises);
});
