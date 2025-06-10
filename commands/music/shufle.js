const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
 
const data = new SlashCommandBuilder()
  .setName('shuffle') // Command name
  .setDescription('Shuffle the tracks in the queue'); // Command description
 
module.exports = {
    data,
    async execute(interaction) {
        // Get the current queue
        const queue = useQueue(interaction.guild);
        
        if (!queue) {
            return interaction.reply(
            'This server does not have an active player session.',
            );
        }
        
        // Check if there are enough tracks in the queue
        if (queue.tracks.size < 2)
            return interaction.reply(
            'There are not enough tracks in the queue to shuffle.',
            );
        
        // Shuffle the tracks in the queue
        queue.tracks.shuffle();
        
        // Send a confirmation message
        return interaction.reply(`Shuffled ${queue.tracks.size} tracks.`);
    }
}