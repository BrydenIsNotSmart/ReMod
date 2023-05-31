const serverModel = require("../database/models/server");
const Embed = require("../functions/embed");
const Members = require("../functions/members");

module.exports = {
    name: "dashboard",
    aliases: ["dash"],
    category: "Information",
    description: "Check the server's dashboard.",
    async run(client, message, args) {
      try {
        const data = await serverModel.findOne({ id: message.server.id });
        const members = await Members(client, message.server.id)
        message.channel.startTyping();
      const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`## **Server Dashbord**\nHere's some info on your server, as well as the link for your dashboard.\n#### **Members**: ${members.members?.length}\n#### **Commands Ran**: ${data.commandsRan}`)
        message.channel.stopTyping();
        await message.reply({ embeds: [embed] }, false)
      } catch (err) {
        console.error(err);
        message.channel.stopTyping();
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\n\`\`\``)
        await message.reply({ embeds: [embed] }, false);
      }
    },
  };