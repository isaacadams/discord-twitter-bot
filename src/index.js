#!/usr/bin/env node

const { Events } = require('discord.js');
const { client } = require('./client');
const { twitterFeedChannel } = require('./database');
const env = require('./env');
const listen = require('./twitter/listen');
require('./interactions');

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageCreate, (msg) => {
  console.log(msg);
  if (msg.content === 'ping') {
    msg.channel.send('pong');
  }
});

listen.tweet$.subscribe(async (tweet) => {
  const channelId = await twitterFeedChannel.get();
  if (!channelId) {
    console.info(`call /feed on a channel to send tweet streams`);
    return;
  }
  const c = await client.channels.fetch(channelId);
  c.send(tweet.link);
});

client.login(env.DISCORD.SECRET);
