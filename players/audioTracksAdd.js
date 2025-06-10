

module.exports = {
	name: "audioTracksAdd",
	execute(queue, track) {
		const {channel} = queue.metadata;
  channel.send(`Multiple Track's queued`);
	},
};