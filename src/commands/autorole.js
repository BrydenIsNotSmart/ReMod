const Embed = require("../functions/embed");

module.exports = {
    name: "autorole",
    aliases: ["role"],
    category: "Utility",
    description: "Setup the auto-role to give to members on join.",
    async run(client, message, args) {
      try {
        
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