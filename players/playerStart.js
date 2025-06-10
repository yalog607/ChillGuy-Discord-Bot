

module.exports = {
	name: "playerStart",
	execute(queue, track) {
		const {channel} = queue.metadata;
  		channel.send(`Started playing: **${track.title}**`);
	},
};