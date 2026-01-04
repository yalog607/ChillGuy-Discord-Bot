const { SlashCommandBuilder, MessageFlags, EmbedBuilder, PermissionsBitField, WebhookClient } = require("discord.js");
const { webhookId, webhookToken } = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("sendbill")
        .setDescription("CẤM DÙNG LỆNH NÀY!!!"),
    async execute(client) {
        if (!client.user.bot) return;
        const data = client.dataBank;
        if(!data) return;
        if(data.transferType !== 'in') return;

        const description = data.description;
        const bigSplit = description.trim().split(/ +/)[4];
        const smaillSplit = bigSplit.trim().split('.')[3];
        const channelID = smaillSplit.split('a')[0];

        const userID = smaillSplit.split('a')[1];
        const channel = await client.channels.fetch(channelID);
        const amount = new Intl.NumberFormat("en").format(data.transferAmount);

        const embed = new EmbedBuilder()
            .setDescription(`> ✅ **Khách hàng <@${userID}> đã thanh toán thành công số tiền \`${amount}VNĐ\`**\n**Xin cảm ơn quý khách đơn hàng của bạn sẽ sớm được xử lý**`)
            .setColor('#B6F500');

        return await channel.send({embeds: [embed]})
    }
    
}