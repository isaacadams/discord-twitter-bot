const {
  Events,
  Collection,
  ChatInputCommandInteraction,
} = require('discord.js');
const { client } = require('./client');
const ping = require('./commands/ping');
const feed = require('./commands/tweet-feed');

const commands = new Collection();
commands.set(ping.data.name, ping);
commands.set(feed.data.name, feed);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);

  let c = commands.get(interaction.commandName);
  if (c != undefined) {
    await c.execute(interaction);
  }
});
