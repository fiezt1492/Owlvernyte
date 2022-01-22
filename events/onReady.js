const { prefix } = require("../config.js");

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
						name: `${prefix}help | Testing with bugs`,
						type: 0,
					},
				],
			});

			const guilds = await client.guilds.cache.map((guild) => guild.id);

			guilds.forEach(async (id) => {
				const guild = await gDB.findOne(
					{
						gID: id,
					},
					{
						prefix: 1,
					}
				);

				client.guildSettings.set(id, {
					prefix: guild ? guild.prefix : prefix,
				});

				if (guilds.indexOf(id) === guilds.length - 1) {
					client.ready = true
				}
			});
		} catch (error) {
			console.log(error);

			client.user.setPresence({
				status: "idle",
				afk: false,
				activities: [
					{
						name: `${prefix}help | Testing with bugs`,
						type: 0,
					},
				],
			});
		}

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
