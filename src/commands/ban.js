const Embed = require("../functions/embed");
const serverModel = require("../database/models/server");

module.exports = {
    name: "ban",
    aliases: ["boot"],
    category: "Moderation",
    usage: "[mention or id] (reason)",
    description: "Ban a member from this server.",
    async run(client, message, args) {
      try {

      if(!message.member?.hasPermission(message.channel, "BanMembers")) {
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(":x: You need the \`Ban Members\` permission to use this command.");
        return message.reply({ embeds: [embed] }, false);
     }

     if (!message.channel?.havePermission('BanMembers')) {
      const embed = new Embed()
      .setColor("#ff4654")
      .setDescription(`:x: I don't have permission to ban them.\nPlease give me the \`Ban Members\` permission!`)
      return await message.reply({ embeds: [embed] }, false);
    }

      } catch (err) {
        console.error(err);
        message.channel.stopTyping();
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
        await message.reply({ embeds: [embed] });
      }
    },
  };