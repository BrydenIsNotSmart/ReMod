const Revolt = require('revolt.js');
const Embed = require("../functions/embed");
const axios = require("axios");
const serverModel = require("../database/models/server");

module.exports = {
	name: "packet",
	async execute(packet, client) {
	try {
    if (packet.type == 'MessageUpdate') {
		if (!packet.data.content) return;
            let m = client.messages.get(packet.id);
            if (m?.author_id == client.user?._id) return;
            const author = client.users.get(m?.author_id);
            if (author.bot) return;
            let oldMsg = String(m?.content ?? '(Unknown)');
            let newMsg = String(packet.data.content);
            const data = await serverModel.findOne({ id: m.channel.server_id });
            if (!data.messagelogs) return;
            const embed = new Embed()
               .setColor("#ff4654")
               .setIcon(author.generateAvatarURL())
               .setTitle(author.username)
               .setDescription(`## **Message Updated**\n**Old Message**: \n\`${oldMsg}\`\n**New Message**:\n\`${newMsg}\`\n**Author ID**:\n\`${m.author_id}\`\n**Channel**:\n<#${m.channel_id}>\n[Jump to this message](https://app.revolt.chat/server/${m.channel.server_id}/channel/${m.channel_id}/${m._id})`)
               await client.channels.get(data.messagelogs).sendMessage({ embeds: [embed] });
        } else if (packet.type == 'MessageDelete') {
          let channel = client.channels.get(packet.channel);
          if (!channel) return;
          let message = client.messages.get(packet.id);
          if (!message) return;

          let msg = String(message.content ?? '(Unknown)');

          let data = await serverModel.findOne({ id: message.channel.server_id });
          if (data.messagelogs) {
              const embed = new Embed()
              .setColor("#ff4654")
              .setDescription(`[\\[#${channel.name}\\]](/server/${channel.server_id}/channel/${channel._id}) | `
              + `[\\[Author\\]](/@${message.author_id}) | `
              + `[\\[Jump to message\\]](/server/${channel.server_id}/channel/${channel._id}/${packet.id})`)

              if (msg.length > 1000) {
                  embed.attachments?.push({ name: 'message.txt', content: Buffer.from(msgRaw) });
              } //else {
               //embed.
              //}

              if (message.attachments?.length) {
                  let autumnURL = await getAutumnURL();
                  embed.fields.push({ title: 'Attachments', content: message.attachments.map(a => 
                      `[\\[${a.filename}\\]](<${autumnURL}/${a.tag}/${a._id}/${a.filename}>)`).join(' | ') })
              }

              await client.channels.get(data.messagelogs).sendMessage({ embeds: [embed] });
           }
        }
     } catch(err) { 
      console.log(err)
     }
	},
};

async function getAutumnURL() {
  return (
      autumn_url ||
      ((await axios.get(client.apiURL)).data).features.autumn.url
  );
}