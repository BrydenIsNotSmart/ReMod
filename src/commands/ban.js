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