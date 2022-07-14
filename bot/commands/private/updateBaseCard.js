const Discord = require("discord.js");

module.exports = {
	name: "updatebasecard",
	description: "",
	category: "private",
	aliases: ["updateb"],
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
    if (!exist) return message.channel.send('This card does not exist')
    const prop = args.shift()
    const props = ['atk', 'def', 'spd', 'skill', 'name', 'rarity', 'type']

    if (!props.includes(prop)) 
      return message.channel.send(`Please enter valid property! (${props.join(' ')})`)
    
    const value = args.join(" ")

    await client.baseCards.update(id, prop, value)

    
    return message.channel.send('Update success')
  },
};