const Revolt = require('revolt.js');
const serverModel = require("../database/models/server");
const Embed = require("../functions/embed");

module.exports = {
	name: "messageUpdate",
	async execute(message, oldMessage) {
        if (!message.content || message.author.bot) return;
        if (message.authorId == client.user?.id) return;
        if (message.author.bot) return;
        let oldMsg = String(oldMessage.content ?? '(Unknown)');
        let newMsg = String(message.content);
        const data = await serverModel.findOne({ id: message.server.id });
        if (!data.messagelogs) return;
        const embed = new Embed()
           .setColor("#ff4654")
           .setIcon(message.author.avatarURL)
           .setTitle(message.author.username)
           .setDescription(`## **Message Updated**\n**Old Message**: \n\`${oldMsg}\`\n**New Message**:\n\`${newMsg}\`\n**Author ID**:\n\`${message.author.id}\`\n**Channel**:\n<#${message.channel.id}>\n[Jump to this message](https://app.revolt.chat/server/${message.server.id}/channel/${message.channel.id}/${message.id})`)
           await client.channels.get(data.messagelogs).sendMessage({ embeds: [embed] });
	},
};