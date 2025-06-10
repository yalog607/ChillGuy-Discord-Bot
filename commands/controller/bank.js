const { SlashCommandBuilder, MessageFlags, EmbedBuilder, PermissionsBitField } = require("discord.js");
const bankInfoJson = require("../../bank.config.json");

let bankArr = [];
for (let ele in bankInfoJson){
    bankArr.push({
        name: `${bankInfoJson[ele].BANK_NAME} - ${bankInfoJson[ele].NAME} - ${bankInfoJson[ele].STK}`,
        value: ele
    })
}
let data = new SlashCommandBuilder()
    .setName("bank")
    .setDescription("Hiện thông tin chuyển khoản của ngân hàng")
    .addStringOption(option => 
        option 
            .setName("type")
            .setDescription('Chọn ngân hàng muốn lấy thông tin')
            .setRequired(true)
    )
    .addIntegerOption(option => 
        option.setName("amount")
            .setDescription("Số tiền muốn hiện trên QR")
            .setRequired(true)
            .setMinValue(100)
    );
bankArr.forEach(bank =>{
    data.options[0].addChoices(bank);
})
module.exports = {
    data: data,
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            return await interaction.reply({content: "❌ Bạn không có quyền thực hiện lệnh này", flags: MessageFlags.Ephemeral});
        }
        const { options, channel } = interaction;
        const shortBank = options.getString("type");
        let amount = options.getInteger("amount");
        if (!shortBank) return await interaction.reply({content: "Vui lòng chọn ngân hàng trước khi dùng lệnh", flags: MessageFlags.Ephemeral});
    
        const bankInfo = require("../../bank.config.json")[shortBank];
        if (!bankInfo) return await interaction.reply({content: `Nhập sai tên ngân hàng, vui lòng nhập lại!`, flags: MessageFlags.Ephemeral });
        if (isNaN(amount)) return await interaction.reply(`Vui lòng nhập số tiền hợp hệ!`);
        const lowerNameBank = bankInfo.BANK_NAME.toLowerCase();
        const arx = bankInfo.NAME.split(/ +/);
        const nameOfAccountBank = arx.join('%20');

        const bankEmbed = new EmbedBuilder()
            .setColor('#f0d3ef')
            .setAuthor({name: "Thông Tin Chuyển Khoản", iconURL: 'attachment://money.png'})
            .setDescription('\n')
            .setImage(`https://img.vietqr.io/image/${lowerNameBank}-${bankInfo.STK}-compact2.jpg?amount=${amount}&addInfo=KiwiKiwi&accountName=${nameOfAccountBank}`)
            .addFields(
                { name: 'Chủ Tài Khoản', value: `\`\`\`${bankInfo.NAME}\`\`\`\u200B` },
                { name: 'Số Tài Khoản', value: `\`\`\`${bankInfo.STK}\`\`\`\u200B` },
                { name: 'Tên Ngân Hàng', value: `\`\`\`${bankInfo.BANK_NAME}\`\`\`\u200B`},
                { name: 'Số Tiền', value: `\`\`\`${amount} VNĐ\`\`\``},
            );

        return await interaction.reply({embeds: [bankEmbed], files: [{
            attachment:'img/money.png',
            name:'money.png'
        }]});
    }
    
}