const serverModel = require("../database/models/server");
const Embed = require("../functions/embed");

module.exports = {
    name: "counting",
    aliases: ["count"],
    category: "Fun/Game",
    usage: "channel <#channel> | toggle",
    description: "Either config the counting system or toggle it off/on.",
    async run(client, message, args) {
      try {
        
        if(args[0] == "channel") {
            const permissionsEmbed = new Embed()
           .setColor("#ff4654")
           .setDescription(":x: You need the \"Manage Channels\" permission to use this command.");
           if (!message.member.hasPermission(message.member.server, "ManageChannel")) return message.reply({ embeds: [permissionsEmbed] });
         const argsEmbed = new Embed()
         .setColor("#ff4654")
         .setDescription(":x: Please provide a correct channel mention or Id to set the counting channel.");
         if(!args[1]) return message.reply({ embeds: [argsEmbed] });
         const channel = message.channel.server.channels.find(c => c._id === args[1].match(new RegExp(`(<#!?(.*)>)`))[2]) || message.channel.server.channels.find(c => c._id === args[1]);
         if(!channel) return message.reply({ embeds: [argsEmbed] });
         const embed = new Embed()
         .setTitle("Counting Channel")
         .setColor("#ff4654")
         .setDescription("This channel has been selected as the new counting channel.\nYou can toggle the counting module off and on by using \`counting toggle\`.")
           try {
             const guild = await serverModel.findOne({ id: message.channel.server_id });
             guild.countingChannel = channel._id;
             await guild.save();
             channel.sendMessage({ embeds: [embed] });
             message.reply(`The counting channel has been successfully set to ${channel}.`)
           } catch(err) {
             console.error(err);
             const errorEmbed = new Embed()
               .setColor("#ff4654")
               .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
             await message.reply({ embeds: [errorEmbed] });
           }
         } else if (args[0] == "toggle") {
         const permissionsEmbed = new Embed()
         .setColor("#ff4654")
         .setDescription("x: You need the \"Manage Server\" permission to use this command.");
         if (!message.member.hasPermission(message.member.server, "ManageServer")) return message.reply({ embeds: [permissionsEmbed] });
         const guild = await serverModel.findOne({ id: message.channel.server_id });
         if (!guild.countingChannel) return message.reply("Please set a counting channel with \`counting channel <channel mention or id>\` first.")
         if (guild.countingEnabled === true) {
             try {
            guild.countingEnabled = false;
            await guild.save();
            message.reply(`I have successfully **disabled** the counting system.`)
             } catch(err) {
                 console.error(err);
                 const errorEmbed = new Embed()
                   .setColor("#ff4654")
                   .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
                 await message.reply({ embeds: [errorEmbed] });
               }
            } else {
             try {
                 guild.countingEnabled = true;
                 guild.countingNumber = "1";
                 await guild.save();
                 message.reply(`I have successfully **enabled** the counting system.`)
                 const channel = message.channel.server.channels.find(c => c._id === guild.countingChannel)
                 channel.sendMessage("Counting system has been enabled, you may start with **2**.\n\n1")
                  } catch(err) {
                      console.error(err);
                      const errorEmbed = new Embed()
                        .setColor("#ff4654")
                        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
                      await message.reply({ embeds: [errorEmbed] });
                    }
            }
         } else if (args[0] == "reset") {
            const permissionsEmbed = new Embed()
            .setColor("#ff4654")
            .setDescription("x: You need the \"Manage Server\" permission to use this command.");
            if (!message.member.hasPermission(message.member.server, "ManageServer")) return message.reply({ embeds: [permissionsEmbed] });
            const guild = await serverModel.findOne({ id: message.channel.server_id });
            if (!guild.countingChannel) return message.reply("Please set a counting channel with \`counting channel <channel mention or id>\` first.")
            if (guild.countingReset === true) {
                try {
               guild.countingReset = false;
               await guild.save();
               message.reply(`I have successfully **disabled** the counting reset.`)
                } catch(err) {
                    console.error(err);
                    const errorEmbed = new Embed()
                      .setColor("#ff4654")
                      .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
                    await message.reply({ embeds: [errorEmbed] });
                  }
               } else {
                try {
                    guild.countingReset = true;
                    await guild.save();
                    message.reply(`I have successfully **enabled** the counting reset.`)
                     } catch(err) {
                         console.error(err);
                         const errorEmbed = new Embed()
                           .setColor("#ff4654")
                           .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
                         await message.reply({ embeds: [errorEmbed] });
                       }
               }
        } else {
             const embed = new Embed()
                        .setColor("#ff4654")
                        .setDescription(`## **Counting System**\nSet counting channel -> \`counting channel <channel>\`\nToggle counting on/off -> \`counting toggle\`\nToggle count reset on/off -> \`counting reset\``)
                      await message.reply({ embeds: [embed] });
         }

      } catch (err) {
        console.error(err);
        message.channel.stopTyping();
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\n\`\`\``)
        await message.reply({ embeds: [embed] });
      }
    },
  };