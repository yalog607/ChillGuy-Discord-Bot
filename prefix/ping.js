
module.exports = {
    name: 'ping',
    description: "Reply with pong!",
    run: (client, message, args) => {
        message.author.send("Hello daddy! 💝")
        message.channel.send("🌾🌾 **Pongg!!**");
    }
}