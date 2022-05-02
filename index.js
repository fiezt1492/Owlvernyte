const { ShardingManager } = require('discord.js');
const { token, topggToken, dev } = require("./config.js");
const manager = new ShardingManager('./bot.js', { token: token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();

if (dev !== "on") {
    const { AutoPoster } = require('topgg-autoposter')
    const ap = AutoPoster(topggToken, manager)

    ap.on('posted', () => {
      console.log('Posted stats to Top.gg!')
    })
}