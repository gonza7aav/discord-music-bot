module.exports = {
  name: 'leave',
  channelType: ['text'],

  execute(message, args, musicPlayer) {
    if (!musicPlayer.connection) return message.reply('I am not in a voice channel.');

    musicPlayer.connection.disconnect();
    musicPlayer.connection = false;
  },

  description: 'Make the bot leave the voice channel.'
};