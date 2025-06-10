const { SlashCommandBuilder } = require('discord.js');
const { useQueue, useTimeline } = require('discord-player');
 
const data = new SlashCommandBuilder()
  .setName('pause') // Command name
  .setDescription('Pause the currently playing song'); // Command description

module.exports = {
    data,
    async execute(interaction) {
    // Get the queue's timeline
    const timeline = useTimeline({
        node: interaction.guild,
    });
    
    if (!timeline) {
        return await interaction.reply(
        'This server does not have an active player session.',
        );
    }
    
    // Invert the pause state
    const wasPaused = timeline.paused;
    
    if(!wasPaused)timeline.pause();
    
    // If the timeline was previously paused, the queue is now back to playing
    return await interaction.reply(
        {content: `The player is now paused.`}
    );
    }
}
