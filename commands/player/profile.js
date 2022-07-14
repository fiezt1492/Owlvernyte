const Discord = require("discord.js");

module.exports = {
	name: "profile",
	description: "Get SO profile",
	category: "player",
	aliases: [],
	usage: "<@user>",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE) {
		const { client } = message;
		const user = message.mentions.users.first() || message.author
		const db = client.db.collection("players")
		const player = await db.findOne({
			id: user.id
		},{
			projection: {
          _id: 0
        }
		})

		const Embed = Discord.MessageEmbed()
		.setTitle()
		.setAuthor()
		.setThumbnail()
    /*
      
    */
		// counter () {100 120 100} / block
		// 100
		// 30
		// 100
		// 70 -> 0.25 0 .75

    // 30 -> 0.25 0 .75
		console.log(player)
    // full / fire ball
    // full / fire ball
    // full / f3
    // full / f3
    // [001, 002, 001, 003, 001, 004]
		// active [, 001, 001, 002]
	},
};
