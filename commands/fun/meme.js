const Discord = require("discord.js");
// const got = require("got");
const fetch = require("node-fetch");

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

		// fetch(`https://meme-api.herokuapp.com/gimme/${subreddit ? subreddit : ""}`).then(res => res.json()).then(json => console.log(json))

		// let res = await fetch(`https://meme-api.herokuapp.com/gimme/${subreddit ? subreddit : ""}`)
		// console.log(res)
		// let json = await res.json()
		// console.log(json)
		// return;

		try {
			http = await fetch(
				`https://meme-api.herokuapp.com/gimme/${subreddit ? subreddit : ""}`
			);
			post = await http.json();
			// console.log(post)
			if (post)
				if (post.code)
					return message.reply(
						`**Error code**: \`${post.code}\` - **Error message**: \`${post.message}\``
					);
			embed
				.setAuthor(`u/${post.author}`)
				.setTitle(String(post.title))
				.setURL(String(post.postLink))
				.setFooter(`r/${post.subreddit} | ⬆ ${post.ups}`);
			if (!(post.nsfw || post.spoiler)) embed.setImage(post.url);
			else
				embed
					.setImage("https://cdn130.picsart.com/322803413346201.jpg")
					.setDescription(
						`⚠ This image is set as **NSFW/Spoiler**.\n||Click **[here](${post.url})** if you want to reveal.||`
					);
		} catch (error) {
			console.log(error);
			if (error.code === "ERR_NON_2XX_3XX_RESPONSE")
				return message.reply(
					`**[ERROR]** I can't find any meme in \`r/${subreddit}\``
				);

			embed.setColor("RED").setTitle("ERROR").setDescription(error);
			return message.reply(embed);
		}
        
		const m = await message.reply({
			embeds: [embed],
			components: [row],
		});

		const filter = (b) => b.user.id === message.author.id;

		const mCol = m.createMessageComponentCollector({
			filter,
			componentType: "BUTTON",
			time: 30000,
		});

		mCol.on("collect", async (btn) => {
			// console.log(btn)
			// await btn.update()
			if (btn.customId === "stop") return mCol.stop();
			if (btn.customId === "more") {
				mCol.resetTimer();
				// embed = new Discord.MessageEmbed().setColor("RANDOM");
				try {
					http = await fetch(
						`https://meme-api.herokuapp.com/gimme/${subreddit ? subreddit : ""}`
					);
					post = await http.json();
					if (post)
						if (post.code)
							if (btn.replied === false)
								return btn.reply(
									`**Error code**: \`${post.code}\` - **Error message**: \`${post.message}\``
								);
							else
								btn.editReply(
									`**Error code**: \`${post.code}\` - **Error message**: \`${post.message}\``
								);
					embed.description = null;
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
					await btn.update({ embeds: [embed] });
				} catch (error) {
					console.log(error);
					// return message.reply(error);
				}
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

			if (reason === "time")
				return m.edit({
					embeds: [embed],
					components: [row],
				});

			if (collected)
				return collected.map(async (btn) => {
					// console.log(btn);
					if (btn.replied === false)
						await btn.update({
							embeds: [embed],
							components: [row],
						});
				});
		});
	},
};
