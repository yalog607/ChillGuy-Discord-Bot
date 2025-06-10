const { Events } = require('discord.js');
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        const client = message.client;
        const { prefix } = require("../config.json");
        if (!message.content.startsWith(prefix) || message.author.bot || message.author.id == client.user.id) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const prefixCmd = client.prefix.get(command);
        if (prefixCmd){
            prefixCmd.run(client, message, args)
        }
    },
};