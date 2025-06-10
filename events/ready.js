const { Events, ActivityType } = require('discord.js');
const mongoose = require("mongoose");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		const MONGO_URL = require("../config.json").MONGO_URL;
		const conn = mongoose.connect(MONGO_URL);
		if (!conn) console.log('Cannot connect to Database');
		else console.log("Connect to Database successfully")
		client.user.setPresence({
			status: 'idle',
			activities: [{ name: `myself`, type: ActivityType.Listening }],
		})
	},
};