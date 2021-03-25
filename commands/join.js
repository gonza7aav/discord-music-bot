module.exports = {
  name: "join",
  channelType: ["text"],

  async execute(message, args, musicPlayer) {
    if (musicPlayer.connection)
      return message.reply(
        `I'm already in \`${musicPlayer.connection.channel.name}\`.`
      );

    // Try to join the sender's voice channel if they are in one.
    if (message.member.voice.channel) {
      await message.member.voice.channel
        .join()
        .then((connection) => {
          musicPlayer.connection = connection;
        })
        .catch((error) => {
          console.error(
            `Could not join to ${message.member.voice.channel}.\n`,
            error
          );
          message.reply("There was an error trying to join that channel.");
        });
    } else {
      message.reply("You are not in a voice channel.");
    }
  },

  description: "Join the voice channel of the sender.",
};
