const Embed = require("../functions/embed");
const serverModel = require("../database/models/server");

module.exports = {
    name: "logs",
    aliases: ["modlogs"],
    category: "Configuration",
    usage: "channel [mention or id]",
    description: "Configure the logging system.",
    async run(client, message, args) {
      try {
        
        if (args[0] == "channel") {
            const guild = await serverModel.findOne({ id: message.channel.server_id });
            const permissionsEmbed = new Embed()
           .setColor("#ff4654")
           .setDescription(":x: You need the \"Manage Channels\" permission to use this command.");
           if (!message.member.hasPermission(message.member.server, "ManageChannel")) return message.reply({ embeds: [permissionsEmbed] });
         const argsEmbed = new Embed()
         .setColor("#ff4654")
         .setDescription(":x: Please provide a correct channel mention or ID to set the logging channel.");
         if (!args[1]) return message.reply({ embeds: [argsEmbed] });
         const channel = message.channel.server.channels.find(c => c._id === args[1].match(new RegExp(`(<#!?(.*)>)`))[2]) || message.channel.server.channels.find(c => c._id === args[1]);
         if (!channel) return message.reply({ embeds: [argsEmbed] });
         if (channel._id == guild.modlogs) return message.reply(`This channel is already set as the current logging channel.`)
         const embed = new Embed()
         .setColor("#ff4654")
         .setDescription("### **Logging System**\nThis channel has been selected as the new logging channel.\nThis channel will now receive logs when a moderation action happens.")
           try {
             guild.modlogs = channel._id;
             await guild.save();
             channel.sendMessage({ embeds: [embed] });
             message.reply(`The logging channel has been successfully set to <#${channel._id}>.`)
           } catch(err) {
             console.error(err);
             const errorEmbed = new Embed()
               .setColor("#ff4654")
               .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
             await message.reply({ embeds: [errorEmbed] });
           }
         } else if (args[0] == "messages-channel") {
            const guild = await serverModel.findOne({ id: message.channel.server_id });
            const permissionsEmbed = new Embed()
           .setColor("#ff4654")
           .setDescription(":x: You need the \"Manage Channels\" permission to use this command.");
           if (!message.member.hasPermission(message.member.server, "ManageChannel")) return message.reply({ embeds: [permissionsEmbed] });
         const argsEmbed = new Embed()
         .setColor("#ff4654")
         .setDescription(":x: Please provide a correct channel mention or ID to set the messages logs channel.");
         if (!args[1]) return message.reply({ embeds: [argsEmbed] });
         const channel = message.channel.server.channels.find(c => c._id === args[1].match(new RegExp(`(<#!?(.*)>)`))[2]) || message.channel.server.channels.find(c => c._id === args[1]);
         if (!channel) return message.reply({ embeds: [argsEmbed] });
         if (channel._id == guild.messagelogs) return message.reply(`This channel is already set as the current message logging channel.`)
         const embed = new Embed()
         .setColor("#ff4654")
         .setDescription("### **Message Logging**\nThis channel has been selected as the new message logging channel.\nThis channel will now receive logs when a message action happens.")
           try {
             guild.messagelogs = channel._id;
             await guild.save();
             channel.sendMessage({ embeds: [embed] });
             message.reply(`The message logging channel has been successfully set to <#${channel._id}>.`)
           } catch(err) {
             console.error(err);
             const errorEmbed = new Embed()
               .setColor("#ff4654")
               .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
             await message.reply({ embeds: [errorEmbed] });
           }
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