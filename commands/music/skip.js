const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
 
const data = new SlashCommandBuilder()
  .setName('skip') // Command name
  .setDescription('Skip the currently playing song'); // Command description
 
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
        
        if (!queue.isPlaying()) {
            return interaction.reply('There is no track playing.');
        }
        
        // Skip the current track
        queue.node.skip();
        const currentSong = queue.currentTrack;
        
        // Send a confirmation message
        const embed = new EmbedBuilder()
            .setColor('#B6F500')
            .setDescription(`**${currentSong.title}** enqueued!`)
        return await interaction.reply({embeds: [embed]});
    }
}