const Embed = require("../functions/embed");

module.exports = {
    name: "automod",
    aliases: ["mod"],
    category: "Moderation",
    description: "Setup the auto-moderation filters.",
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