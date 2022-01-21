const express = require("express");
const Discord = require("discord.js");
const Topgg = require("@top-gg/sdk");
const webhook = new Topgg.Webhook(process.env.TOPGG_AUTH);
const server = express();
const { port } = require("./config");

module.exports = (client) => {
	server.all("/", (req, res) => {
		res.send(
			`Bot is running.<br>Default Prefix: ${process.env.PREFIX}<br>Bot ID: ${process.env.BOT_ID}`
		);
	});

	server.post(
		"/dblwebhook",
		webhook.listener(async (vote) => {
			const user = await client.users.fetch(vote.user);

			let embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Thanks for voting me, " + user.tag + "!");

			user.send({
				embeds: [embed],
			});
		})
	);

	keepAlive();
};

var keepAlive = () => {
	server.listen(port, () => {
		console.log("Server is ready.");
	});
};
