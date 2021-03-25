module.exports = {
  name: "pause",
  channelType: ["text"],

  execute(message, args, musicPlayer) {
    if (!musicPlayer.dispatcher)
      return message.reply("I am not playing music.");

    musicPlayer.dispatcher.pause();
  },

  description: "Pause the music.",
};
