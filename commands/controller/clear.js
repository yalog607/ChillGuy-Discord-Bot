const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Xóa tin nhắn gần đây!")
        .addIntegerOption((option) => 
            option
                .setName("amount")
                .setDescription("Số lượng tin nhắn muốn xóa")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
            )   
        .addUserOption((option) => 
            option
                .setName("target")
                .setDescription("Chỉ điền khi muốn xóa tin nhắn từ người này!")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const { options, channel } = interaction;
        let amount = options.getInteger("amount");
        const target = options.getUser("target");

        if (!amount || amount > 100 || amount < 1){
            return await interaction.reply({content: "Hãy chỉ nhập số lượng trong khoảng 1 đến 100", flags: MessageFlags.Ephemeral});
        }

        try {
            const channelMessages = await channel.messages.fetch();
            if (channelMessages.size === 0){
                return await interaction.reply({
                    content: "Channel không có tin nhắn nào để xóa",
                    flags: MessageFlags.Ephemeral
                })
            }
            if (amount > channelMessages.size) amount = channelMessages.size;
            const clearEmbed = new EmbedBuilder().setColor("#41fb3a");
            await interaction.deferReply({flags: MessageFlags.Ephemeral});
            let msgToDel = [];
            if (target){
                let i = 0;
                channelMessages.forEach((m) => {
                    if(m.author.id === target.id && msgToDel.length < amount){
                        msgToDel.push(m);
                        i++;
                    }
                })
                clearEmbed.setDescription(`✅ Đã xóa thành công ${amount} tin nhắn từ ${target} trong ${channel}`)
            } else {
                msgToDel = channelMessages.first(amount);
                clearEmbed.setDescription(`✅ Đã xóa thành công ${amount} tin nhắn trong ${channel}`)
            }
            if (msgToDel.length > 0){
                await channel.bulkDelete(msgToDel, true);
            }
            await interaction.editReply({embeds: [clearEmbed]})
        } catch (error) {
            console.log(error);
            await interaction.followUp({
                content: "Tin nhắn quá 14 ngày hoặc có lỗi phát sinh trong quá trình xóa tin nhắn",
                flags: MessageFlags.Ephemeral
            })   
        }
    }

}