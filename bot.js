const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const {
	prefix,
	token,
	client_id,
	test_guild_id,
	dev,
	web,
} = require("./config.js");

const intents = [
	"GUILDS",
	"GUILD_MEMBERS",
	"GUILD_BANS",
	"GUILD_INTEGRATIONS",
	"GUILD_WEBHOOKS",
	"GUILD_INVITES",
	"GUILD_VOICE_STATES",
	"GUILD_PRESENCES",
	"GUILD_MESSAGES",
	"GUILD_MESSAGE_REACTIONS",
	"GUILD_MESSAGE_TYPING",
	"DIRECT_MESSAGES",
	"DIRECT_MESSAGE_REACTIONS",
	"DIRECT_MESSAGE_TYPING",
];

const client = new Client({
	intents: [intents],
	ws: { intents: intents },
	disableMentions: "everyone",
	restTimeOffset: 0,
	shard: "auto",
	allowedMentions: {
		repliedUser: false,
	},
});

const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.skip) continue;
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(
			event.name,
			async (...args) => await event.execute(...args, client)
		);
	}
}

/**********************************************************************/
// Define Collection of Commands, Slash Commands and cooldowns

const keepAlive = require("./server");
require("./modules/util/client")(client);

client.i18n = require("./modules/util/i18n");
client.db = require("./databases/mongo.js");
client.guildSettings = new Collection();
client.commands = new Collection();
client.ready = false;
client.private = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.triggers = new Collection();

// private
const commandFolders = fs.readdirSync("./commands");

// Loop through all files and store commands in commands collection.

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.private.set(command.name, command);
	}
}

/**********************************************************************/
// Registration of Slash-Command Interactions.

const commands = fs.readdirSync("./interactions/slash");

// Loop through all files and store slash-commands in slashCommands collection.

for (const module of commands) {
	const commandFiles = fs
		.readdirSync(`./interactions/slash/${module}`)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/slash/${module}/${commandFile}`);
		if (dev !== "on" && command.dev) continue;
		if (command.maintain || command.guildOwner)
			command.data.setDefaultPermission(false);
		if (command.dm && command.dm == true) command.data.setDMPermission(true);
		else if (!command.dm || (command.dm && command.dm == false))
			command.data.setDMPermission(false);
		client.commands.set(command.data.name, command);
	}
}

/**********************************************************************/
// Registration of Context-Menu Interactions

const contextMenus = fs.readdirSync("./interactions/context-menus");

// Loop through all files and store slash-commands in slashCommands collection.

for (const folder of contextMenus) {
	const files = fs
		.readdirSync(`./interactions/context-menus/${folder}`)
		.filter((file) => file.endsWith(".js"));
	for (const file of files) {
		const menu = require(`./interactions/context-menus/${folder}/${file}`);
		const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
		client.contextCommands.set(keyName, menu);
	}
}

/**********************************************************************/
// Registration of Button-Command Interactions.

const buttonCommands = fs.readdirSync("./interactions/buttons");

// Loop through all files and store button-commands in buttonCommands collection.

for (const module of buttonCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/buttons/${module}`)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/buttons/${module}/${commandFile}`);
		client.buttonCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of Modal-Command Interactions.

/**
 * @type {String[]}
 * @description All modal commands.
 */

const modalCommands = fs.readdirSync("./interactions/modals");

// Loop through all files and store modal-commands in modalCommands collection.

for (const module of modalCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/modals/${module}`)
		.filter((file) => file.endsWith(".js"));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/modals/${module}/${commandFile}`);
		client.modalCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of select-menus Interactions

const selectMenus = fs.readdirSync("./interactions/select-menus");

// Loop through all files and store select-menus in slashCommands collection.

for (const module of selectMenus) {
	const commandFiles = fs
		.readdirSync(`./interactions/select-menus/${module}`)
		.filter((file) => file.endsWith(".js"));
	for (const commandFile of commandFiles) {
		const command = require(`./interactions/select-menus/${module}/${commandFile}`);
		client.selectCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of Slash-Commands in Discord API

const rest = new REST({ version: "10" }).setToken(token);

const commandJsonData = [
	...Array.from(client.commands.values()).map((c) => c.data.toJSON()),
	...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
	try {
		console.log("Started refreshing application (/) commands.");
		if (dev === "on") {
			if (!test_guild_id || !client_id)
				return console.log("Missing required guild");
			await rest.put(
				/**
			 * Here we are sending to discord our slash commands to be registered.
					There are 2 types of commands, guild commands and global commands.
					Guild commands are for specific guilds and global ones are for all.
					In development, you should use guild commands as guild commands update
					instantly, whereas global commands take upto 1 hour to be published. To
					deploy commands globally, replace the line below with:
				Routes.applicationCommands(client_id)
			 */
				// Routes.applicationCommands(client_id),
				Routes.applicationGuildCommands(client_id, test_guild_id),
				{ body: commandJsonData }
			);
		} else {
			await rest.put(Routes.applicationCommands(client_id), {
				body: commandJsonData,
			});
		}

		console.log(
			`Successfully reloaded ${
				dev === "on" ? "guild " + test_guild_id : "global"
			} application (/) commands.`
		);
	} catch (error) {
		console.error(error);
	}
})();

/**********************************************************************/
// Registration of Message Based Chat Triggers

const triggerFolders = fs.readdirSync("./triggers");

// Loop through all files and store commands in commands collection.

for (const folder of triggerFolders) {
	const triggerFiles = fs
		.readdirSync(`./triggers/${folder}`)
		.filter((file) => file.endsWith(".js"));
	for (const file of triggerFiles) {
		const trigger = require(`./triggers/${folder}/${file}`);
		client.triggers.set(trigger.name, trigger);
	}
}

// Login into your client application with bot's token.
if (web === "on") keepAlive(client);
client.login(token);
