

module.exports = {
	name: "playerSkip",
	execute(queue, track) {
		const {channel} = queue.metadata;
  		channel.send(`Skipping **${track.title}** due to an issue!`);
	},
};