const Discord = require("discord.js");

module.exports = {
	name: "removebasecard",
	description: "",
	category: "private",
	aliases: ["removeb"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: true,
	once: false,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, ONCE) {
		const { client } = message;
    
    const id = String(args[0])
    
    const exist = await client.baseCards.get(id)
    if (!exist) 
      return message.channel.send('This card does not exist')
    
    await client.baseCards.remove(id)
		client.baseCardsList = await client.baseCards.getAll()
    
    return message.channel.send('Remove success')
  },
};