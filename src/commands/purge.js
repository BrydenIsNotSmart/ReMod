const Embed = require("../functions/embed");

module.exports = {
    name: "purge",
    aliases: ["clear"],
    category: "Moderation",
    usage: "[amount]",
    description: "Purge a large number of messages in a channel at one time.",
    async run(client, message, args) {
      try {

        if(!message.member.hasPermission(message.channel, ["ManageMessages"])) {
            const embed = new Embed()
            .setColor("#ff4654")
            .setDescription(`:x: You don't have permission to delete these messages.`)
            return await message.reply({ embeds: [embed] });
        }
            if(!args[0]) {
               const embed = new Embed()
              .setColor("#ff4654")
              .setDescription(`:x: Please specify an amount of messages to purge. **Max: 100**.`)
              return await message.reply({ embeds: [embed] });
            }
            if(+args[0] > 100) return message.channel.sendMessage(":x: Maximum amount of messages you can purge is 100.")
    
            try {
                (await message.channel.fetchMessages({ limit: +args[0] + 1 })).forEach((message) => deleteMessage(message))
            } catch(err) {
                console.error(err);
                message.channel.stopTyping();
                const embed = new Embed()
                .setColor("#ff4654")
                .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
                await message.reply({ embeds: [embed] });
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
}

  async function deleteMessage(message){
    try{
        message.delete()
    } catch(err) {
        console.error(err);
        message.channel.stopTyping();
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
        await message.reply({ embeds: [embed] });
    }
}