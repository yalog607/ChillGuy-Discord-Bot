

module.exports = {
	name: "emptyChannel",
	execute(queue) {
		const {channel} = queue.metadata;
  		channel.send(`Leaving because no vc activity for the past 5 minutes`);
	},
};