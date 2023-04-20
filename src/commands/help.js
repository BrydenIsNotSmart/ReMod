const Embed = require("../functions/embed");
const { readdirSync } = require("node:fs");
const serverModel = require("../database/models/server")

module.exports = {
  name: "help",
  category: "Info",
  aliases: ["commands"],
  description: "Some helpfull stuff on the bot.",
  async run(client, message, args) {

    const commands = client.commands.filter(c => c.name !== "help").map(c => `\`${c.name}\``);
    message.channel.startTyping();
    if (!args[0]) {
    const embed = new Embed()
      .setColor("#ff4654")
      .setDescription(`## ${client.user.username} Help\nType !help [command] to learn more about a command.\n### **Commands**:\n${commands.join(", ")}`)
      message.channel.stopTyping();
      return await message.reply({ embeds: [embed] }).catch(() => null);
    } else {  
    const data = await serverModel.findOne({ id: message.channel.server_id });
    if(!data) await serverModel.create({ id: message.channel.server_id })
    const prefix = data.prefix ?? config.bot.prefix;

    let catts = [];

    readdirSync("./src/commands/").forEach(() => {
      const commands = readdirSync(`./src/commands/`).filter((file) =>
        file.endsWith(".js")
      );

      const cmds = commands.map((command) => {
        let file = require(`../commands/${command}`);

        if (!file.name) return "No command name.";

        let name = file.name.replace(".js", "");

        let des = client.commands.get(name).description;

        let obj = {
          cname: `\`${name}\``,
          des,
        };

        return obj;
      });

      let dota = new Object();

      cmds.map((co) => {
        dota = {
          name: `${cmds.length === 0 ? "In progress." : co.cname}`,
          value: co.des ? co.des : "No Description",
          inline: true,
        };
        catts.push(dota);
      });

    });

    const command =
      client.commands.get(args[0].toLowerCase()) ||
      client.commands.find(
        (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
      );


    if (!command) {
      const embed = new Embed()
        .setDescription(
          `Invalid command! Use \`${prefix}help\` for all of my commands!`
        )
        .setColor("#ff4654");
        message.channel.stopTyping();
      return await message.reply({ embeds: [embed] });
    }

    const embed = new Embed()
      .setDescription(`## **Command Details**\n\n### **Command**:\n\`${command.name || "No name for this command." }\`\n\n### **Aliases**:\n\`${command.aliases.join(", ") || "No aliases for this command." }\`\n\n### **Usage**:\n \`${prefix}${command.name} ${command.usage || " "}\`\n\n### **Description**: \n\`${command.description}\``)
      .setColor("#ff4654");
      message.channel.stopTyping();
    return await message.reply({ embeds: [embed] });
  }
    console.log(client.user)
    } 
};
