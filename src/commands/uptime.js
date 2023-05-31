const Embed = require("../functions/embed");

module.exports = {
    name: "uptime",
    aliases: ["time"],
    category: "Information",
    description: "Check the bots uptime.",
    async run(client, message, args) {
      try {
        message.channel.startTyping();
        const unixstamp = Math.floor((Date.now() / 1000) | 0) - Math.floor(process.uptime());
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`**I've been online since** <t:${unixstamp}:R>`)
        message.channel.stopTyping();
        await message.reply({ embeds: [embed] }, false)
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