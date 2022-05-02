const { ShardingManager } = require('discord.js');
const { token, topggToken } = require("./config.js");
const manager = new ShardingManager('./bot.js', { token: token });
const { AutoPoster } = require('topgg-autoposter')

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();

const ap = AutoPoster(topggToken, manager)

ap.on('posted', () => {
  console.log('Posted stats to Top.gg!')
})