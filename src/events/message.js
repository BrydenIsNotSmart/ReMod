const Revolt = require('revolt.js');
const serverModel = require("../database/models/server");
const Embed = require('../functions/embed');

module.exports = {
	name: "message",
	async execute(message) {
        try {
        if (!message.member || message.author.bot) return;
        const data = await serverModel.findOne({ id: message.channel.server_id });
        if(!data) await serverModel.create({ id: message.channel.server_id })
        const prefix = data.prefix ?? config.bot.prefix;

        if (message.channel._id === data.countingChannel) {
          if (!data.countingEnabled) return;
           if (message.author._id === client.user._id) return;
             if (data.countingMember === message.author._id) {
              if (data.countingReset) { 
                message.react(encodeURI("❌"))
                message.channel.sendMessage(`<@${message.author._id}> **RUINED** IT AT ${data.countingNumber}!! Next number is **1**.\nTypeError: \`You can't count two numbers in a row.\``)
                data.countingNumber = 0;
                data.countingMember = client.user._id;
                await data.save();
                } else {
              message.delete().catch(() => {
                message.channel.sendMessage(`I am missing the permission "ManageMessages" please add that to my role(s) so I can work properly!`)
              });

                message.channel.sendMessage(`<@${message.author._id}>, it's not your turn, please let someone else go next!`).then(msg => {
                setTimeout(() => msg.delete().catch(() => {
                  message.channel.sendMessage(`I am missing the permission "ManageMessages" please add that to my role(s) so I can work properly!`)
                }), 5000)
              })
            }
              return;
             }
              let number = data.countingNumber + 1;
              if (message.content.includes(number)) {
                data.countingNumber = data.countingNumber + 1;
                data.countingMember = message.author._id;
                await data.save();
                message.react(encodeURI("✅"))
              } else {
                if (data.countingReset) { 
                message.react(encodeURI("❌"))
                message.channel.sendMessage(`<@${message.author._id}> **ruined** it at ${data.countingNumber}! Next number is 1.\nTypeError: \`Wrong Number\``)
                data.countingNumber = 0;
                data.countingMember = client.user._id;
                await data.save();
                } else {
               message.delete();
               return message.channel.sendMessage(`<@${message.author._id}>, that was the wrong number!\nPlease continue with the correct number: **${data.countingNumber + 1}**`).then(msg => {
                setTimeout(() => msg.delete(), 5000)
              })
             }
            }
         }
         if (message.author.bot) return;
        const pingEmbed = new Embed()
       .setColor("#ff4654")
       .setDescription(`## :wave: **Heyo, I'm ${client.user.username}**\nMy prefix for this server is **${prefix}**\nRun **${prefix}help** for a full list of my commands.`)
       if (message.content.match(new RegExp(`^(<@!?${client.user._id}>)`))) {
        message.channel.startTyping();
        setTimeout(() => { 
          message.channel.stopTyping();
          return message.reply({ embeds: [pingEmbed] }) }, 200);
     }
        if (!message.content.toLowerCase().startsWith(prefix)) return;
        let args = message.content.split(" ");
        let command = args.shift().slice(prefix.length).toLowerCase();
        let cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
        if (!cmd) return;
          if (message.channel?.havePermission('SendMessage')) {
            data.commandsRan = data.commandsRan + 1;
            await data.save();
            await cmd.run(client, message, args)
          } else return;
        } catch (error) {
          console.error(error);
          await message.reply({ 
            embeds: [
                { 
                description: `:x: There was an error while executing this command! \n\`\`\`js\n${error}\`\`\``, 
                colour: "#ff4654" }
             ]
           });
        }
	}, 
};