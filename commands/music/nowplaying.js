const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue, useTimeline } = require('discord-player');
 
const data = new SlashCommandBuilder()
  .setName('nowplaying') // Command name
  .setDescription('Display the currently playing song'); // Command description
module.exports = {
    data: data,
    async execute(interaction) {
    // Get the current queue
    const queue = useQueue(interaction.guild);
    
    if (!queue) {
        return await interaction.reply(
        'This server does not have an active player session.',
        );
    }
    
    // Get the currently playing song
    const track = queue.currentTrack;
    const embed = new EmbedBuilder()
                    .setColor('#B6F500')
                    .setDescription(`🎧 Bài nhạc đang phát: **[${track.title}](${track.url})**`)
                    .setThumbnail(track.thumbnail || null)
                    .setFooter({ text: `Được yêu cầu bởi ${interaction.user.tag}` });
    console.log(track)
    // Check if there is a song playing
    if (!track) {
        return await interaction.reply('No song is currently playing.');
    }
    
    // Send the currently playing song information
    return await interaction.reply({embeds: [embed]});
    }
}