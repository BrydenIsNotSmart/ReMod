const Embed = require("../functions/embed");
const serverModel = require("../database/models/server");

module.exports = {
    name: "ping",
    aliases: ["latency", "delay"],
    category: "Information",
    description: "Check the bots ping. (Delay)",
    async run(client, message, args) {
      try {
        const beforeCall = Date.now();
        await serverModel.findOne();
        const dbPing = Date.now() - beforeCall;
        message.channel.startTyping();
        const mesg = await message.reply(":ping_pong: Pong!", false);
        message.channel.stopTyping();
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`### :ping_pong: Ping Pong\nBot Latency: \`${mesg.createdAt - message.createdAt}ms\`\n Websocket Latency: \`${client.events.ping()}ms\`\n Datebase Latency: \`${dbPing}ms\``)
        await mesg.edit({ content: " ", embeds: [embed] });
      } catch (err) {
        console.error(err);
        message.channel.stopTyping();
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
        await message.reply({ embeds: [embed] }, false);
      }
    },
  };