const Discord = require("discord.js");
module.exports = {
	name: "test",
	description: "this is a test command",
	category: "misc",
	// aliases: [""],
	usage: "",
	// cooldown: 5,
	// args: false,
	ownerOnly: true,
	// permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player) {
		const { client } = message;
        
        // await Player.cooldownsPush(this.name, 10000)
		// await Player.owlet(-1000)
		// const player = await Player.set(message.author.id);

		// if (!player) return console.log("false");

		// console.log(await Player.cooldownsGet(this.name));
	},
};
