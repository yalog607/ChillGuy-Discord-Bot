const { blockQuote, bold, italic, quote, spoiler, strikethrough, underline, subtext, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'snipe',
    description: "Hiển thị tin nhắn đã xóa gần nhất",
    run: async(client, message, args) => {
        const msgDel = client.msgDelete.get(message.channelId);
        if (!msgDel) return await message.reply({content: "❌ Không có tin nhắn nào đã xóa trong Channel này!"})
        if (msgDel.attachments.first() && msgDel.attachments.first().contentType.startsWith("image")) return;

        const successEmbed = new EmbedBuilder()
            .setColor("#f5bcf3")
            .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL(), })
            .setDescription(`\`${msgDel.content}\``)
            .setFooter({ text: `Đã xóa lúc ${new Date(msgDel.createdTimestamp).toLocaleString()}`});
        return await message.reply({embeds: [successEmbed]});
    }
}