const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js');
const { twitterFeedChannel } = require('../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feed')
    .setDescription('creates a new twitter feed'),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await twitterFeedChannel.set(interaction.channelId);
    await interaction.reply(
      `set this channel to be the twitter feed: ${await twitterFeedChannel.get()}`
    );
  },
};
