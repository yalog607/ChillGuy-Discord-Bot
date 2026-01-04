const { SlashCommandBuilder, MessageFlags, EmbedBuilder, bold, PermissionsBitField, Message } = require("discord.js");
const { useMainPlayer, QueryType  } = require('discord-player');
const { DefaultExtractors, } = require('@discord-player/extractor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Chơi nhạc")
        .addStringOption(option => 
            option
                .setName("query")
                .setDescription("Tên hoặc URL của bài hát")
                .setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel)
            return await interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
        const query = interaction.options.getString('query', true); // we need input/query to play
        const permissions = channel.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionsBitField.Flags.Connect) || !permissions.has(PermissionsBitField.Flags.Speak)) {
            return await interaction.reply({ content: 'Bot không có quyền kết nối hoặc nói trong kênh thoại này!', flags: MessageFlags.Ephemeral });
        }
        
        await interaction.deferReply();

        try {
            let searchEngineOption = QueryType.AUTO;
            if (!query.startsWith('http://') && !query.startsWith('https://')) {
                searchEngineOption = QueryType.YOUTUBE_SEARCH;
            }
            const searchResult = await player.search(query, {
                requestedBy: interaction.user,
                fallbackSearchEngine: searchEngineOption
            });
            if (!searchResult || searchResult.tracks.length === 0) {
                return await interaction.followUp(`Không tìm thấy bài hát nào cho: **${query}**`);
            }
            const { track, queue } = await player.play(channel, searchResult.tracks[0], {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                    },
                    bufferingTimeout: 1500, //How long the player should attempt buffering before giving up
                    leaveOnStop: true, //If player should leave the voice channel after user stops the player
                    leaveOnStopCooldown: 5000, //Cooldown in ms
                    leaveOnEnd: false, //If player should leave after the whole queue is over
                    leaveOnEmpty: false, //If the player should leave when the voice channel is empty
                },
                initialSpeakers: [interaction.member.id]
            });
            console.log(track);
            const embed = new EmbedBuilder()
                .setColor('#B6F500')
                .setDescription(`🎧 Đã thêm **[${track.title}](${track.url})** vào hàng đợi!`)
                .setThumbnail(track.thumbnail || null)
                .setFooter({ text: `Được yêu cầu bởi ${interaction.user.tag}` });

            return await interaction.followUp({ embeds: [embed] });
        } catch (e) {
            console.error(`Lỗi khi cố gắng phát nhạc: ${e.message}`, e);
            if (e.message.includes('No audio filters were found') || e.message.includes('Could not extract stream')) {
                return await interaction.followUp('Không thể phát bài hát này. Có thể do lỗi bản quyền hoặc định dạng không được hỗ trợ.');
            }
            return await interaction.followUp(`Đã xảy ra lỗi: ${e.message}`);
        }
    }
    
}