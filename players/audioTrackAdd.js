

module.exports = {
	name: "audioTrackAdd",
	execute(queue, track) {
		const {channel} = queue.metadata;
  		channel.send(`Track **${track.title}** queued`);
	},
};