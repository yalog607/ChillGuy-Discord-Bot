const { SlashCommandBuilder, MessageFlags, EmbedBuilder, bold, PermissionsBitField } = require("discord.js");
const User = require("../../models/user.js");
const Product = require("../../models/product.js");

let data = new SlashCommandBuilder()
    .setName("add")
    .setDescription("Hiện thông tin chuyển khoản của ngân hàng")
    .addUserOption(option => 
        option 
            .setName("user")
            .setDescription('Chọn khách hàng')
            .setRequired(true)
    )
    .addIntegerOption(option => 
        option.setName("amount")
            .setDescription("Số lượng sản phẩm")
            .setRequired(true)
            .setMinValue(1)
    )
    .addStringOption(option => 
        option.setName("product")
            .setDescription("Tên sản phẩm")
            .setRequired(true)
    )
    .addIntegerOption(option => 
        option.setName("price")
            .setDescription("Số tiền khách thanh toán")
            .setRequired(true)
    );

module.exports = {
    data: data,
    cooldown: 1,
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            return await interaction.reply({content: "❌ Bạn không có quyền thực hiện lệnh này", flags: MessageFlags.Ephemeral});
        }
        const { options, channel } = interaction;
        const user = options.getUser("user");
        const amount = options.getInteger("amount");
        const product = options.getString("product");
        const price = options.getInteger("price");
        const guildMember = await interaction.guild.members.fetch(user.id);
        const userJoinTime = guildMember.joinedTimestamp;
        const joinTimeUnformat = new Date(userJoinTime);
        const joinAt = joinTimeUnformat.getDate() + '/' +  joinTimeUnformat.getMonth() + '/' + joinTimeUnformat.getFullYear();
        try {
            const userDis = await User.findOne({userId: user.id});
            if(!userDis) {
                const newUser = new User({
                    username: `<@${user.id}>`,
                    userId: user.id,
                    joinAt: joinAt,
                    amountUsed: price
                });
                await newUser.save();
                const newProduct = new Product({
                    name: product,
                    userId: user.id,
                    amount: amount,
                    price: price,
                })
                await newProduct.save();
                const embedSuccess = new EmbedBuilder().setColor("#41fb3a")
                                        .setDescription(`✅ Thêm ${product} cho ${bold(`${user.username}`)} thành công!`);
                return await interaction.reply({embeds: [embedSuccess], flags: MessageFlags.Ephemeral});
            } else {
                await userDis.updateOne({amountUsed: Number(userDis.amountUsed + price)});
                const newProduct = new Product({
                    name: product,
                    userId: user.id,
                    amount: amount,
                    price: price,
                })
                await newProduct.save();
                const embedSuccess = new EmbedBuilder().setColor("#41fb3a")
                                        .setDescription(`✅ Thêm \`${product}\` cho ${bold(`${user.username}`)} thành công!`);
                return await interaction.reply({embeds: [embedSuccess], flags: MessageFlags.Ephemeral});
            }
        } catch (error) {
            console.log(error);
            return await interaction.reply({content: "❌ Có lỗi xảy ra, không thể thêm đơn hàng này!", flags: MessageFlags.Ephemeral});
        }
    }
    
}