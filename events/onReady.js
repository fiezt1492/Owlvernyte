const { prefix } = require("./config");

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
			client.guilds.cache
				.map((guild) => guild.id)
				.forEach(async (id) => {
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
				});
		} catch (error) {
			console.log(error);
		}

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
