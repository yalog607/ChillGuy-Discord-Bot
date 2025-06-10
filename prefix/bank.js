const { blockQuote, bold, italic, quote, spoiler, strikethrough, underline, subtext, MessageFlags, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, ComponentType } = require('discord.js');

module.exports = {
    name: 'bank',
    description: "Hiện tài khoản bank cho khách hàng",
    run: async(client, message, args) => {
        if (args.length !== 2) return await message.reply({content: `Vui lòng nhập đúng 2 mục theo định dạng: <Tên NH> <số tiền>` });
        const shortBank = args.shift();
        const amount = Number(args.shift());
        const bankInfo = require("../bank.config.json")[shortBank];
        if (!bankInfo) return await message.reply({content: `Nhập sai tên ngân hàng, vui lòng nhập lại!`});
        if (isNaN(amount)) return await message.reply(`Vui lòng nhập số tiền hợp hệ!`);
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

        return await message.reply({embeds: [bankEmbed], files: [{
            attachment:'img/money.png',
            name:'money.png'
        }]});
    }
}