const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { useQueue } = require('discord-player');
 
const data = new SlashCommandBuilder()
  .setName('queue') // Command name
  .setDescription('Display the current queue'); // Command description
 
module.exports = {
    data,
    async execute(interaction) {
    // Get the current queue
    const queue = useQueue(interaction.guild);
    console.log(queue.history);
    
    if (!queue) {
        return interaction.reply(
        'This server does not have an active player session.',
        );
    }
    // return interaction.reply({content: `Lệnh đang lỗi, chưa dùng được hẹ hẹ hẹ`, flags: MessageFlags.Ephemeral});
    // Get the current track
    const currentTrackTitle = queue.currentTrack;
    
    // Get the upcoming tracks
    const upcomingTracks = queue.tracks;
    
    // Create a message with the current track and upcoming tracks
    const message = [
        `**Now Playing:** ${currentTrackTitle.title} - ${currentTrackTitle.author}`,
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