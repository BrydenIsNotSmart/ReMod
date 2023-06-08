const Embed = require("../functions/embed");

module.exports = {
    name: "purge",
    aliases: ["clear"],
    category: "Moderation",
    usage: "[amount] [userid[,userid...]]",
    description: "Purge a large number of messages in a channel at one time.",
    async run(client, message, args) {
      try {
        if (!message.channel?.havePermission('ManageMessages')) {
          const embed = new Embed()
          .setColor("#ff4654")
          .setDescription(`:x: I don't have permission to delete these messages.\nPlease give me the Manage Messages permission!`)
          return await message.reply({ embeds: [embed] }, false);
        }
        if(!message.member?.hasPermission(message.channel, ["ManageMessages"])) {
            const embed = new Embed()
            .setColor("#ff4654")
            .setDescription(`:x: You don't have permission to delete these messages.`)
            return await message.reply({ embeds: [embed] }, false);
        }
        let messages = [];

            if (/^[0-9]+$/g.test(args[0])) {
                let amount = Number(args[0]);
                if (isNaN(amount)) {
                  const embed = new Embed()
                  .setColor("#ff4654")
                  .setDescription(`:x: You provided me with an invalid amount.`)
                  return await message.reply({ embeds: [embed] }, false);
                }
                if (amount > 100) {
                  const embed = new Embed()
                  .setColor("#ff4654")
                  .setDescription(`:x: You cannot provide me with a amount above 100.`)
                  return await message.reply({ embeds: [embed] }, false);
                }
                messages = await message.channel.fetchMessages({
                    limit: amount,
                    before: message.id,
                });
            }

            else if (
                /^[0-9A-HJ-KM-NP-TV-Z]{26}-[0-9A-HJ-KM-NP-TV-Z]{26}$/g.test(
                    args[0]
                )
            ) {
                let [id1, id2] = args[0].split("-");

                let [msg1, msg2] = await Promise.all([
                    message.channel.fetchMessage(id1),
                    message.channel.fetchMessage(id2),
                ]);

                if (decodeTime(msg1.id) < decodeTime(msg2.id)) {
                    [msg1, msg2] = [msg2, msg1];
                }

                messages = await message.channel.fetchMessages({
                    before: id2,
                    after: id1,
                    limit: 100,
                    sort: "Latest",
                });

                if (!messages.find((m) => m.id == msg1.id))
                    messages = [msg1, ...messages];
                if (!messages.find((m) => m.id == msg2.id))
                    messages = [...messages, msg2];

                messages = messages.filter(
                    (m) =>
                        decodeTime(m.id) <= decodeTime(id2) &&
                        decodeTime(m.id) >= decodeTime(id1)
                );
            }

            else if (/^[0-9A-HJ-KM-NP-TV-Z]{26}$/g.test(args[0])) {
                messages = [await message.channel.fetchMessage(args[0])];
            } else {
                return message.reply(
                    `I can't parse that message range.`
                );
            }

            if (args[1]) {
                let p = args[1].split(",").map((u) => (u));
                let users = await Promise.all(p);

                if (users.filter((u) => !u).length > 0)
                    return message.reply(
                        "At least one of the supplied users could not be found."
                    );

                messages = messages.filter((m) =>
                    users.find((u) => u.id == m.authorId)
                );
            }

            await message.channel?.deleteMessages(messages.map((m) => m.id));

            const replyMsg = await message.channel
                ?.sendMessage({
                    content: `:white_check_mark: I have deleted ${messages.length} messages.`,
                })
                .catch(console.error);

            setTimeout(async () => {
                try {
                    await message.channel?.deleteMessages([
                        replyMsg.id,
                        message.id,
                    ]);
                } catch (e) {
                    console.error(e);
                }
            }, 6000);

      } catch (err) {
        console.error(err);
        message.channel.stopTyping();
        const embed = new Embed()
        .setColor("#ff4654")
        .setDescription(`:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``)
        await message.reply({ embeds: [embed] }, false);
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
        await message.reply({ embeds: [embed] }, false);
    }
}