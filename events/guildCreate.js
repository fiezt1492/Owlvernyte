const { prefix } = require("../config")
// const guildPrefix = require("../modules/configuration/guildPrefix")

module.exports = {
	name: "guildCreate",
	// skip: true,
	async execute(guild, client) {
		// console.log(guild.id);
        try {
            const DB = client.db.collection("guildSettings")
            await DB.updateOne(
				{
					gID: guild.id,
				},
				{
					$set: {
						gID: guild.id,
						prefix: String(prefix).toLowerCase(),
					},
				},
				{
					upsert: true,
				}
			);

            client.guildSettings.set(guild.id, {
				prefix: String(prefix).toLowerCase(),
			});
        } catch (err) {
            console.log(err);
        }
        
	},
};
