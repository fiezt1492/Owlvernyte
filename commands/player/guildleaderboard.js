const Discord = require("discord.js");
const { millify } = require("millify");
const stringTable = require("string-table");

module.exports = {
	name: "guildleaderboard",
	description: "Show your guild top players",
	category: "player",
	aliases: ["guildtop", "guildleaderboards"],
	usage: "",
	cooldown: 10,
	args: false,
	ownerOnly: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings) {
		const { client, guild } = message;
    const db = await client.db.collection("players")
    const ids = guild.members.cache
      .filter((m) => !m.user.bot)
      .map((m) => String(m.id))
      
    const players = await db.find({
      id: {
        $in: ids
      }
    }).sort({
          owlet: -1,
          bank: -1
        }).limit(10).toArray()

    const data = players.map((o) => {
      const bal = o.owlet + o.bank
      return {
        top: String(players.indexOf(o) + 1),
        owlets: millify(bal),
        player: client.users.cache.get(o.id).tag
      }
    })

		const table = stringTable.create(data, {
			capitalizeHeaders: true,
			formatters: {
				top: function (value, header) {
					return `#${value}`;
				},
			},
		});

    const rate = players.map(o => o.id)
    const footer = `${message.author.tag} • #`

		const Embed = new Discord.MessageEmbed()
			.setTitle(`${guild.name}'s Top ${data.length}`)
			.setColor("RANDOM")
			.setDescription("```" + table + "```")
			.setFooter({
				text:
					rate.some(id => id === message.author.id) ? `${footer}${(rate.indexOf(message.author.id) + 1)}` : `${footer}+`,
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
			});

		return message.reply({
			embeds: [Embed],
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};
