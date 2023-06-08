const Revolt = require('revolt.js');
const https = require("https");
const serverModel = require("../database/models/server");
const Embed = require("../functions/embed");
const Upload = require("revolt-uploader");
const Uploader = new Upload(client);

module.exports = {
	name: "messageDelete",
	async execute(message) {
        if (message.author.bot) return;
        let channel = client.channels.get(message.channelId);
        let author = message.authorId ? client.users.get(message.authorId) : null;
        if (!channel) return;
        let messageContent = String(message.content ?? '(Unknown)');
        if(!messageContent|| messageContent == '') messageContent = "(Unknown)";
        const data = await serverModel.findOne({ id: channel.server.id });
        if (!data.messagelogs) return;
        let description = "";
        const embed = new Embed()
           .setColor("#ff4654")
           .setIcon(author.avatarURL)
           .setTitle(author.username)
           .setDescription(`## **Message Deleted**\n**Content**: \n\`${messageContent}\`\n**Author ID**:\n\`${message.authorId}\`\n**Channel**:\n<#${message.channelId}>\n[Jump to this message](https://app.revolt.chat/server/${channel.server.id}/channel/${message.channelId}/${message.id})`)
           if (message.attachments?.length) {
            embed.addField('Attachments', message.attachments.map(a => 
                `[\\[${a.filename}\\]](<https://autumn.revolt.chat/${a.tag}/${a.id}/${a.filename}>)`).join(' | '))
        }
        await client.channels.get(data.messagelogs).sendMessage({ embeds: [embed] }).catch(() => { });
	},
};