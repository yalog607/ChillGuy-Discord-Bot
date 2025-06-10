const { Events } = require('discord.js');
module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        const client = message.client;
        await client.msgDelete.set(message.channelId, message);
    },
};