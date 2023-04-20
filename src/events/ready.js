const Revolt = require('revolt.js');

module.exports = {
	name: "ready",
	execute(client) {
		console.info(`[INFO] ${client.user.username} is logged in and ready.`)
		client.users.edit({
			status: {
			  text: `@ReMod | !help | ${client.servers.size} servers.`,
			  presence: "Online",
			},
		});
	},
};