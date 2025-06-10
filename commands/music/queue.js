const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
 
const data = new SlashCommandBuilder()
  .setName('queue') // Command name
  .setDescription('Display the current queue'); // Command description
 
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
    
    // Get the current track
    const currentTrack = queue.current;
    
    // Get the upcoming tracks
    const upcomingTracks = queue.tracks.slice(0, 5);
    
    // Create a message with the current track and upcoming tracks
    const message = [
        `**Now Playing:** ${currentTrack.title} - ${currentTrack.author}`,
        '',
        '**Upcoming Tracks:**',
        ...upcomingTracks.map(
        (track, index) => `${index + 1}. ${track.title} - ${track.author}`,
        ),
    ].join('\n');
    
    // Send the message
    return interaction.reply(message);
    }
}