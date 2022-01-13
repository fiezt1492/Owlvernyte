const { prefix } = require("../config");

module.exports = {
	name: "ready",
	once: true,

	async execute(client) {
		// client.user.setPresence({})
		const rDB = client.db.collection("restart");

		const restarted = await rDB.findOne({ uID: "445102575314927617" });

		if (restarted) {
			const channel = await client.channels.fetch(restarted.cID);
			const m = await channel.messages.fetch(restarted.mID);
			m.edit("Restarted!").then(rDB.deleteOne({ uID: "445102575314927617" }));
			console.log("[RESTART] RESTARTED THE BOT");
		}

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
