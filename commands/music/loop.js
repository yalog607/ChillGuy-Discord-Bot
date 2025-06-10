const { SlashCommandBuilder } = require('discord.js');
const { QueueRepeatMode, useQueue } = require('discord-player');
 
const data = new SlashCommandBuilder()
  .setName('loop') // Command name
  .setDescription('Loop the queue in different modes') // Command description
  .addNumberOption((option) =>
    option
      .setName('mode') // Option name
      .setDescription('The loop mode') // Option description
      .setRequired(true) // Option is required
      .addChoices(
        {
          name: 'Off',
          value: QueueRepeatMode.OFF,
        },
        {
          name: 'Track',
          value: QueueRepeatMode.TRACK,
        },
        {
          name: 'Queue',
          value: QueueRepeatMode.QUEUE,
        },
        {
          name: 'Autoplay',
          value: QueueRepeatMode.AUTOPLAY,
        },
      ),
  );
 
module.exports = {
    data,
    async execute(interaction) {
    // Get the current queue
    const queue = useQueue(interaction.guild);
    
    if (!queue) {
        return await interaction.reply(
        'This server does not have an active player session.',
        );
    }
    
    // Get the loop mode
    const loopMode = interaction.options.getNumber('mode');

    const QRM = {
        0: 'off',
        1: 'track',
        2: 'queue',
        3: 'autoplay'
    }
    
    // Set the loop mode
    queue.setRepeatMode(loopMode);
    
    // Send a confirmation message
    return await interaction.reply(`Loop mode set to **${QRM[loopMode]}**`);
    }
}