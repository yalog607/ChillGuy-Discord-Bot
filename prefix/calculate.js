const { blockQuote, bold, italic, quote, spoiler, strikethrough, underline, subtext } = require('discord.js');

module.exports = {
    name: 't',
    description: "Tính toán",
    run: async(client, message, args) => {
        if (!Array.isArray(args) || args.length === 0 || args.length < 3 || args.length%2===0) return message.channel.send(`Dữ liệu nhập vào không hợp lệ.`);

        let tempArray = [];
        for (let i = 0; i < args.length; i++) {
            const item = args[i];
            if (item === '*' || item === '/') {
                const num1 = parseFloat(tempArray.pop());
                const num2 = parseFloat(args[++i]);

                let result;
                if (item === '*') {
                    result = num1 * num2;
                } else {
                    if (num2 === 0) {
                        return message.channel.send(`${underline('Lỗi')}: Không thể chia cho 0.`);
                    }
                    result = num1 / num2;
                }
                tempArray.push(result);
            } else {
                tempArray.push(item);
            }
        }

        let finalResult = parseFloat(tempArray[0]);
        for (let i = 1; i < tempArray.length; i += 2) {
            const operator = tempArray[i];
            const num = parseFloat(tempArray[i + 1]);

            if (operator === '+') {
                finalResult += num;
            } else if (operator === '-') {
                finalResult -= num;
            } else {
                return message.channel.send(`${underline('Lỗi')}: Toán tử không hợp lệ (Chỉ dùng \'+\' hoặc \'-\' hoặc \'*\' hoặc \'/\').`);
            }
        }
        await message.reply(`${bold("Kết Quả")}: ${finalResult}`);
    }
}