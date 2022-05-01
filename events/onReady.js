const { prefix } = require("../config.js");
const defaultPrefix = prefix;

module.exports = {
	name: "ready",
	once: true,

	async execute(client) {
		// client.user.setPresence({})
		const rDB = client.db.collection("restart");
		const gDB = client.db.collection("guildSettings");

		const restarted = await rDB.findOne({ uID: "445102575314927617" });

		if (restarted) {
			const channel = await client.channels.fetch(restarted.cID);
			const m = await channel.messages.fetch(restarted.mID);
			m.edit("Restarted!").then(rDB.deleteOne({ uID: "445102575314927617" }));
			console.log("[RESTART] RESTARTED THE BOT");
		}

		try {
			client.user.setPresence({
				status: "online",
				afk: false,
				activities: [
					{
						name: `owlvernyte.tk/recard`,
						type: 0,
					},
				],
			});

			client.guilds.cache.forEach(async (guild) => {
				const guildDB = await gDB.findOne(
					{
						gID: guild.id,
					},
					{
						// prefix: 1,
						locale: 1,
					}
				);

				client.guildSettings.set(guild.id, {
					// prefix: guild
					// 	? guild.prefix
					// 		? guild.prefix
					// 		: defaultPrefix
					// 	: defaultPrefix,
					locale: guildDB ? (guildDB.locale ? guildDB.locale : "en") : "en",
				});

				if (client.guildSettings.size == client.guilds.cache.size) {
					client.ready = true;
					console.log("Ready to emit events!")
				}
			});
		} catch (error) {
			console.log(error);

			client.user.setPresence({
				status: "idle",
				afk: false,
				activities: [
					{
						name: `/help | Restarting...`,
						type: 0,
					},
				],
			});
		} finally {
		}

		console.log(`Logged in as ${client.user.tag}!`);
	},
};
