const Revolt = require('revolt.js');

module.exports = {
	name: "ready",
	execute(client) {
		console.info(`[INFO] ${client.user.username} is logged in and ready.`)
		client.api.patch("/users/@me", { status: { text: `@ReMod | !help | ${client.servers.size()} servers.`, presence: "Online" } });
	},
};