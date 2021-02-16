module.exports = {
  name: 'volume',
  channelType: ['text'],
  args: true,

  execute(message, args, musicPlayer) {
    let percentage = Number(args[0]);
    if (percentage >= 0 && percentage <= 100) {
      // The volume could be changed, even when is no music playing.
      musicPlayer.volume = percentage / 100;
      musicPlayer.dispatcher.setVolume(musicPlayer.volume);
    } else {
      message.reply('Select a valid percentage [0% - 100%].');
    }
  },

  description: 'Change the volume of the music.',
  usage: '<percentage>'
};