const Discord = require("discord.js");

module.exports = {
	name: "addbasecase",
	description: "",
	category: "private",
	aliases: ["addbce"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE) {
		const { client } = message;
    const id = args.shift()
    const exist = await client.baseCards.get(id)
    if (exist) {
			return message.channel.send("Duplicated")
		}
    const name = args.join(" ")

    const filter = (m) => message.author.id === m.author.id;
		
    const msgCol = message.channel.createMessageCollector({
			filter,
			max: 7,
			time: 60000,
		});
		const array = [];
		let content = "Insert Card's id and rate: (example: 001 0.4)"
    let msg = await message.channel.send(content)

		msgCol.on("collect", async (m) => {
			let input = m.content.trim().split(/ +/g)
      if (input[0] === '$end' ) return msgCol.stop()
      const cardId = input.shift()
      const cardExist = await client.baseCards.get(cardId)
      if (!cardExist)
        return message.channel.send("This card doesn't exist")
      const rate = input.shift()
      array.push({
        cardId,
        rate
      })

			msgCol.resetTimer()
			
			message.channel.send(`**[${cardExist.rarity.toUpperCase()}]** | ${cardExist.name} \`ID: ${cardExist.id.toUpperCase()}\` is entered the queue`)
      message.channel.send(content)
    });

    msgCol.on("end", async (collected, reason) => {
      if (reason === 'time') {
        return msg.edit('TIMEOUT')
      }
			// console.log(array)
			// console.log(collected.map(c => c.content))
			const result = await client.baseCases.set(id, name, array)  
      if (result !== -1 ) message.channel.send('Success!')
      else message.channel.send('Failed!')
    })
    
		
  },
};
