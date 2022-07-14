const Discord = require("discord.js");

module.exports = {
	name: "addbasecard",
	description: "",
	category: "private",
	aliases: ["addbcd"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE) {
		const { client } = message;
    const filter = (m) => message.author.id === m.author.id;
		
    const msgCol = message.channel.createMessageCollector({
			filter,
			max: 8,
			time: 60000,
		});
		const array = [];
		let content = "Insert Case's id: "
    let msg = await message.channel.send(content)
		const rarities = ['c', 'uc', 'r', 'sr', 'ssr', 'ur', 'e', 'l']

		msgCol.on("collect", async (m) => {
			let input = m.content
			array.push(input.trim().replace(/\s/g))

      if (array.length === 1)
			{
      	const exist = await client.baseCards.get(array[0])
				if (exist) {
					return msgCol.stop("duplicated")
				}
			} 
			
			msgCol.resetTimer()
			switch (array.length) {
				case 1:
          content = "Insert Card's name: "
        	break;
        case 2:
					content = "Insert Card's rarity: "
        	break;
				case 3:
          content = "Insert Card's type: "
        	break;
        case 4:
					content = "Insert Card's atk: "
        	break;
        case 5:
					content = "Insert Card's def: "
        	break;
        case 6:
					content = "Insert Card's spd: "
        	break;
        case 7:
					content = "Insert Card's skill: "
        	break; 
			}
			if (array.length != 8) message.channel.send(content)
		});

    msgCol.on("end", async (collected, reason) => {
      if (reason === 'time') {
        return msg.edit('TIMEOUT')
      }
			if (reason === 'duplicated') {
        return msg.edit('Duplicated!')
      }
			// console.log(array)
			// console.log(collected.map(c => c.content))
			const result = await client.baseCards
    	.set(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7])  
			client.baseCardsList = await client.baseCards.getAll()
      if (result !== -1 ) message.channel.send('Success!')
      else message.channel.send('Failed!')
    })
    
		
  },
};
