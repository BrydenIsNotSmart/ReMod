const { getCode, clean } = require("@elara-services/eval-helper");
const Embed = require("../functions/embed");
const Members = require("../functions/members");

module.exports = {
    name: "eval",
    category: "Developer Only",
    usage: "[code]",
    aliases: ["evaluate"],
    description: "Evaluates Javascript code in a command.",
    async run(client, message, args) {
        message.channel.startTyping();
        if (!config.ownerids.includes(message.author._id)) {
            message.channel.stopTyping();
            return message.reply(":x: This is an owner only command.");
        }
        const errorEmbed = new Embed()
        .setColor("#ff4654")
        .setDescription(`:x: You must provide code to evaluate.`)
        if (!args[0]) return message.reply({ embeds: [errorEmbed] });

        try {
            const evaled = await getCode({ code: args.join(" ") });
            const code = await clean(eval(evaled), [ client.session ]);
            const embed = new Embed()
            .setColor("#ff4654")
            .setDescription(`## **Output**\n\`\`\`js\n${code}\n\`\`\``)
            message.channel.stopTyping();
            return message.reply({ embeds: [embed] });

        } catch (e) {   
        message.channel.stopTyping();
        const embed = new Embed()
       .setColor("#ff4654")
       .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${e.stack}\`\`\``)
        return message.reply({ embeds: [embed] })
        }
    },
};

function allServers(client) {
    let names = [];
    let iterator = client.servers.entries();
    for (let v = iterator.next(); !v.done; v = iterator.next()) {
        names.push(v.value[1]);
    };
    return names.map(e => e);
}
