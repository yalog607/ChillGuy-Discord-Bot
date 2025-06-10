

module.exports = {
	name: "playerError",
	execute(queue, error) {
		console.log(`Player error event: ${error.message}`);
  		console.log(error);
	},
};