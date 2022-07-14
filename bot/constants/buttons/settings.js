const Discord = require("discord.js");

module.exports = (state) => [
    new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
            .setCustomId("ephepanel")
            .setDisabled(state)
            .setLabel("Ephemeral")
            .setStyle("PRIMARY"),
        // new Discord.MessageButton()
        //     .setCustomId("localepanel")
        //     .setDisabled(state)
        //     .setLabel("Locale/Language")
        //     .setStyle("PRIMARY"),
        new Discord.MessageButton()
            .setCustomId("cancel")
            .setDisabled(state)
            .setLabel("Cancel")
            .setStyle("DANGER")
    ),
]