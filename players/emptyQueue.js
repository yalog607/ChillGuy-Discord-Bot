

module.exports = {
	name: "emptyQueue",
	execute(queue) {
		const {channel} = queue.metadata;
  		channel.send('Queue finished!');	
	},
};