const play = require("./play.js");

module.exports = {
  name: "next",
  channelType: ["text"],

  async execute(message, args, musicPlayer) {
    play.execute(message, [], musicPlayer);
  },

  description: "Play the next song.",
};
