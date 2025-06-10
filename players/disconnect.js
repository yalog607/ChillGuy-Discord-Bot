

module.exports = {
	name: "disconnect",
	execute(queue) {
		// Emitted when the bot leaves the voice channel
		const {channel} = queue.metadata;
		channel.send('Looks like my job here is done, leaving now!');
	},
};