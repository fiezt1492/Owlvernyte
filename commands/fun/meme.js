const Discord = require("discord.js");
const got = require("got");

module.exports = {
	name: "meme",
	description: "Generate random meme",
	category: "fun",
    aliases: ["mêm"],
	usage: "<subreddit>",
	permissions: "SEND_MESSAGES",
	guildOnly: true,

	async execute(message, args) {
		const { client } = message;
		let subreddit = args.join("_");

		if (!isNaN(Number(subreddit))) subreddit = null;
		const embed = new Discord.MessageEmbed().setColor("RANDOM");
		let http;
		let post;

		let row = new Discord.MessageActionRow().addComponents(
			new Discord.MessageButton()
				.setCustomId("more")
				.setLabel("More!")
				.setStyle("SUCCESS"),
			new Discord.MessageButton()
				.setCustomId("stop")
				.setLabel("Stop")
				.setStyle("SECONDARY")
		);

		try {
			http = await got(
				`https://meme-api.herokuapp.com/gimme/${subreddit ? subreddit : ""}`
			);
			post = JSON.parse(http.body);
			embed
				.setAuthor(`u/${post.author}`)
				.setTitle(post.title)
				.setURL(post.postLink)
				.setFooter(`r/${post.subreddit} | ⬆ ${post.ups}`);
			if (!(post.nsfw || post.spoiler)) embed.setImage(post.url);
			else
				embed
					.setImage("https://cdn130.picsart.com/322803413346201.jpg")
					.setDescription(
						`⚠ This image is set as **NSFW/Spoiler**.\n||Click **[here](${post.url})** if you want to reveal.||`
					);
		} catch (error) {
			// console.log(error)
			if (error.code === "ERR_NON_2XX_3XX_RESPONSE")
				return message.reply(
					`**[ERROR]** I can't find any meme in \`r/${subreddit}\``
				);

			embed.setColor("RED").setTitle("ERROR").setDescription(error);
			return message.reply(embed);
		}

		const m = await message.channel.send({
			embeds: [embed],
			components: [row],
		});

		const filter = (b) => b.user.id === message.author.id;

		const mCol = m.createMessageComponentCollector({ filter,componentType: "BUTTON", time: 30000 });

		mCol.on("collect", async (btn) => {
			btn.deferUpdate();
            // console.log(btn)
			if (btn.customId === "stop") return mCol.stop();
			if (btn.customId === "more") {
				mCol.resetTimer();
				const Embed = new Discord.MessageEmbed().setColor("RANDOM");
				try {
					http = await got(
						`https://meme-api.herokuapp.com/gimme/${subreddit ? subreddit : ""}`
					);
					post = JSON.parse(http.body);
					Embed.setAuthor(`u/${post.author}`)
						.setTitle(post.title)
						.setURL(post.postLink)
						.setFooter(`r/${post.subreddit} | ⬆ ${post.ups}`);
					if (!(post.nsfw || post.spoiler)) Embed.setImage(post.url);
					else
						Embed.setImage(
							"https://cdn130.picsart.com/322803413346201.jpg"
						).setDescription(
							`⚠ This image is set as **NSFW/Spoiler**.\n||Click **[here](${post.url})** if you want to reveal.||`
						);
				} catch (error) {
					console.log(error);
					return message.reply(error);
				}
				await btn.editReply({ embeds: [Embed]});
			}
		});

		mCol.on("end", async (collected, reason) => {

			row = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("more")
					.setLabel("More!")
					.setStyle("SUCCESS")
					.setDisabled(true),
				new Discord.MessageButton()
					.setCustomId("stop")
					.setLabel("Stop")
					.setStyle("SECONDARY")
					.setDisabled(true)
			);
            

            // await collected.deferReply()

			return m.edit({
				embeds: [embed],
				components: [row],
			});
		});
	},
};
