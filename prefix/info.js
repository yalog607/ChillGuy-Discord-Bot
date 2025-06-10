const {
  bold,
  MessageFlags,
  EmbedBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  PermissionsBitField
} = require("discord.js");
const User = require("../models/user.js");
const Product = require("../models/product.js");

module.exports = {
  name: "info",
  description: "Thông tin khách hàng",
  run: async (client, message, args) => {
    let userTag = '';
    if (args.length == 1) userTag = args[0];
    else userTag = `<@${message.author.id}>`;

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && args.length == 1){
        return await message.reply({
            content: `Bạn không có quyển kiểm tra người khác`,
        });
    }

    const userId = userTag.slice(2, userTag.length - 1);
    const user = await User.findOne({ userId });
    const guildMember = await message.guild.members.fetch(userId);
    const userJoinTime = guildMember.joinedTimestamp;
    const joinTimeUnformat = new Date(userJoinTime);
    const joinAt =
      joinTimeUnformat.getDate() +
      "/" +
      joinTimeUnformat.getMonth() +
      "/" +
      joinTimeUnformat.getFullYear();
    if (!user) {
      const newUser = new User({
        username: userTag,
        userId: userId,
        joinAt: joinAt,
        amountUsed: 0,
      });
      await newUser.save();
      const embedSuccess = new EmbedBuilder()
      .setColor(guildMember.displayHexColor)
      .setAuthor({
        name: "Thông Tin Khách Hàng",
        iconURL: "attachment://anh_server.jpg",
      })
      .addFields(
        { name: ``, value: `> **Khách hàng**: ${userTag}\n> **Ngày gia nhập**: ${joinAt}`},
        { name: "", value: "\n" },
        {
          name: "💳 Tổng số tiền đã chi",
          value: `\`0 VNĐ\``,
          inline: true,
        },
        { name: "🏆 Xếp hạng", value: `<@&${guildMember.roles.highest.id}>`, inline: true },
        { name: "", value: "\n" },
        { name: "🖨️ Sản phẩm", value: `` }
      )
      .setThumbnail(guildMember.displayAvatarURL())
      .setFooter({
        text: `${message.author.username} | ${new Date(message.createdTimestamp).toLocaleString()}`,
        iconURL: message.author.displayAvatarURL(),
      });
      return await message.reply({
        embeds: [embedSuccess],
        files: [
          {
            attachment: "img/anh_server.jpg",
            name: "anh_server.jpg",
          },
        ],
      });
    }

    const product = await Product.find({ userId });
    let productList = "";
    product.forEach((pro) => {
      productList += `> \`${pro.name} x${pro.amount} ${new Intl.NumberFormat("en").format(pro.price)}VNĐ\`\n`;
    });
    let stringAmountUsed = new Intl.NumberFormat("en").format(user.amountUsed);
    const embedSuccess = new EmbedBuilder()
      .setColor(guildMember.displayHexColor)
      .setAuthor({
        name: "Thông Tin Khách Hàng",
        iconURL: "attachment://anh_server.jpg",
      })
      .addFields(
        { name: ``, value: `> **Khách hàng**: ${userTag}\n> **Ngày gia nhập**: ${joinAt}`},
        { name: "", value: "\n" },
        {
          name: "💳 Tổng số tiền đã chi",
          value: `\`${stringAmountUsed} VNĐ\``,
          inline: true,
        },
        { name: "🏆 Xếp hạng", value: `<@&${guildMember.roles.highest.id}>`, inline: true },
        { name: "", value: "\n" },
        { name: "🖨️ Sản phẩm", value: `${productList}` }
      )
      .setThumbnail(guildMember.displayAvatarURL())
      .setFooter({
        text: `${message.author.username} | ${new Date(message.createdTimestamp).toLocaleString()}`,
        iconURL: message.author.displayAvatarURL(),
      });
    return await message.reply({
      embeds: [embedSuccess],
      files: [
        {
            attachment: "img/anh_server.jpg",
            name: "anh_server.jpg",
        }
      ],
    });
  },
};
