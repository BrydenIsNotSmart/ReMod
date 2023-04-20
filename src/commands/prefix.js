const Embed = require("../functions/embed");
const serverModel = require("../database/models/server");

module.exports = {
    name: "prefix",
    aliases: ["setprefix"],
    category: "Configuration",
    usage: "set [prefix]",
    description: "Check or set the bot's prefix.",
    async run(client, message, args) {

      try {
        message.channel.startTyping();
        const data = await serverModel.findOne({ id: message.channel.server_id });
        if (args[0] == "set") {
            if (!message.member.hasPermission(message.member.server, "ManageServer")) return message.reply(":x: You don't have permission to change the server prefix.");
            if (!args[1]) {
              const embed = new Embed()
                .setColor("#ff4654")
                .setDescription(`:x: Please provide me with a prefix to set.\n**Example**:\n\`\`\`${data.prefix ?? config.bot.prefix}prefix set ?\`\`\``)
                message.channel.stopTyping();
            return await message.reply({ embeds: [embed] })
            }
            if (args[1].length > 5) {
              const embed = new Embed()
                .setColor("#ff4654")
                .setDescription(`:x: The prefix must be below 5 characters.\n **Example**:\n\`\`\`${data.prefix ?? config.bot.prefix}prefix set ?\`\`\``)
                message.channel.stopTyping();
            return await message.reply({ embeds: [embed] })
            }
            try {
              data.prefix = args[1];
              await data.save()
              const embed = new Embed()
                .setColor("#ff4654")
                .setDescription(`## **:white_check_mark: Prefix Set Successfully**\nThe prefix for this server has been successfully set to \`${args[1]}\`.`)
                message.channel.stopTyping();
                await message.reply({ embeds: [embed] })
            } catch(err) {
                console.error(err);
                message.channel.stopTyping();
                const embed = new Embed()
                .setColor("#ff4654")
                .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
                message.channel.stopTyping();
                await message.reply({ embeds: [embed] });
            }
        } else {
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`## **Prefix**\n**Server Prefix**:\n \`${data.prefix ?? config.bot.prefix}\`\n**Default Prefix**: \n\`${config.bot.prefix}\`\n\nRun \`${data.prefix ?? config.bot.prefix}prefix set [prefix] \` to set your server's prefix.`)
        message.channel.stopTyping();
        await message.reply({ embeds: [embed] })
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