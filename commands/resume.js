module.exports = {
  name: "resume",
  channelType: ["text"],

  execute(message, args, musicPlayer) {
    if (!musicPlayer.dispatcher)
      return message.reply("I am not playing music.");

    musicPlayer.dispatcher.resume();
  },

  description: "Resume the music.",
};
