const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} = require('discord.js');
const { twitterFeedChannel } = require('../database/database');
const twitterService = require('../service/twitter.service');
const { getTwitterUsers } = require('../service/twitter.service');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('feed')
    .setDescription('manage a twitter feed')
    .addSubcommand((sc) =>
      sc.setName('info').setDescription('displays info about this twitter feed')
    )
    .addSubcommand((sc) =>
      sc
        .setName('follow')
        .setDescription('adds a twitter account to the feed')
        .addStringOption((opt) =>
          opt
            .setName('handle')
            .setDescription('twitter handle (username) you want to follow')
            .setRequired(true)
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand && !!commands[subcommand]) {
      await commands[subcommand](interaction);
    }

    if (false) {
      await twitterFeedChannel.set(interaction.channelId);
      await interaction.reply(
        `set this channel to be the twitter feed: ${await twitterFeedChannel.get()}`
      );
    }
  },
};

const commands = {
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  configure: (interaction) => {},
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  follow: async (interaction) => {
    const handle = interaction.options.getString('handle');
    const success = await twitterService.followUser(handle).catch(async (e) => {
      await interaction.reply({ content: e, ephemeral: true });
      return false;
    });

    if (success) {
      const users = (await getTwitterUsers())
        .map((u) => `-> ${u.name} (${u.link})`)
        .join('\r\n');

      await interaction.reply({ content: users, ephemeral: true });
    }
  },
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  info: async (interaction) => {
    const users = (await getTwitterUsers())
      .map((u) => `-> ${u.name} (${u.link})`)
      .join('\r\n');

    await interaction.reply({ content: users, ephemeral: true });
  },
};
