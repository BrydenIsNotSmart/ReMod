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
           if (!message.member.hasPermission(message.server, "ManageChannel")) return message.reply({ embeds: [permissionsEmbed] }, false);
         const argsEmbed = new Embed()
         .setColor("#ff4654")
         .setDescription(":x: Please provide a correct channel mention or Id to set the counting channel.");
         if(!args[1]) return message.reply({ embeds: [argsEmbed] }, false);
         const channel = message.server.channels.find(c => c.id === args[1].match(new RegExp(`(<#!?(.*)>)`))[2]) || message.server.channels.find(c => c.id === args[1]);
         if(!channel) return message.reply({ embeds: [argsEmbed] }, false);
         const embed = new Embed()
         .setTitle("Counting Channel")
         .setColor("#ff4654")
         .setDescription("This channel has been selected as the new counting channel.\nYou can toggle the counting module off and on by using \`counting toggle\`.")
           try {
             const guild = await serverModel.findOne({ id: message.server.id });
             guild.countingChannel = channel.id;
             await guild.save();
             channel.sendMessage({ embeds: [embed] });
             message.reply(`The counting channel has been successfully set to ${channel}.`, false)
           } catch(err) {
             console.error(err);
             const errorEmbed = new Embed()
               .setColor("#ff4654")
               .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
             await message.reply({ embeds: [errorEmbed] }, false);
           }
         } else if (args[0] == "toggle") {
         const permissionsEmbed = new Embed()
         .setColor("#ff4654")
         .setDescription("x: You need the \"Manage Server\" permission to use this command.");
         if (!message.member.hasPermission(message.server, "ManageServer")) return message.reply({ embeds: [permissionsEmbed] }, false);
         const guild = await serverModel.findOne({ id: message.server.id });
         if (!guild.countingChannel) return message.reply("Please set a counting channel with \`counting channel <channel mention or id>\` first.", false)
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
                 await message.reply({ embeds: [errorEmbed] }, false);
               }
            } else {
             try {
                 guild.countingEnabled = true;
                 guild.countingNumber = "1";
                 await guild.save();
                 message.reply(`I have successfully **enabled** the counting system.`, false)
                 const channel = message.server.channels.find(c => c.id === guild.countingChannel)
                 channel.sendMessage("Counting system has been enabled, you may start with **2**.\n\n1", false)
                  } catch(err) {
                      console.error(err);
                      const errorEmbed = new Embed()
                        .setColor("#ff4654")
                        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
                      await message.reply({ embeds: [errorEmbed] }, false);
                    }
            }
         } else if (args[0] == "reset") {
            const permissionsEmbed = new Embed()
            .setColor("#ff4654")
            .setDescription("x: You need the \"Manage Server\" permission to use this command.");
            if (!message.member.hasPermission(message.member.server, "ManageServer")) return message.reply({ embeds: [permissionsEmbed] }, false);
            const guild = await serverModel.findOne({ id: message.server.id });
            if (!guild.countingChannel) return message.reply("Please set a counting channel with \`counting channel <channel mention or id>\` first.", false)
            if (guild.countingReset === true) {
                try {
               guild.countingReset = false;
               await guild.save();
               message.reply(`I have successfully **disabled** the counting reset.`, false)
                } catch(err) {
                    console.error(err);
                    const errorEmbed = new Embed()
                      .setColor("#ff4654")
                      .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
                    await message.reply({ embeds: [errorEmbed] }, false);
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
                         await message.reply({ embeds: [errorEmbed] }, false);
                       }
               }
        } else if (args[0] == "set") {
          const permissionsEmbed = new Embed()
          .setColor("#ff4654")
          .setDescription("x: You need the \"Manage Server\" permission to use this command.");
          if (!message.member.hasPermission(message.server, "ManageServer")) return message.reply({ embeds: [permissionsEmbed] }, false);
          const guild = await serverModel.findOne({ id: message.server.id });
          if (!guild.countingChannel) return message.reply(":x: Please set a counting channel with \`counting channel <channel mention or id>\` first.", false)
          let number = Number(args[1]);
          if (isNaN(number)) return message.reply(":x: You provided me with an invaild number.", false)
         if (!number) return message.reply(":x: Please provide me with a number to set the current counting number to.", false)
         guild.countingNumber = number;
         await guild.save();
         const channel = message.server.channels.find(c => c.id === guild.countingChannel)
         channel.sendMessage(`**The current counting number has been changed to \`${number}\`, you can continue with \`${number + 1}\`.**`, false)
         message.reply(`:white_check_mark: I have successfully changed the current counting number to ${number}.`, false)
        } else {
          const embed = new Embed()
          .setColor("#ff4654")
          .setDescription(`## **Counting System**\nSet counting channel -> \`counting channel <channel>\`\nToggle counting on/off -> \`counting toggle\`\nToggle count reset on/off -> \`counting reset\`\nSet the counting number -> \`counting set <number>\``)
          await message.reply({ embeds: [embed] }, false);
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