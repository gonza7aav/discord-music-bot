module.exports = {
  name: 'stop',
  channelType: ['text'],

  execute(message, args, musicPlayer) {
    if (!musicPlayer.dispatcher) return message.reply('I am not playing music.');
    
    musicPlayer.dispatcher.destroy();
    musicPlayer.dispatcher = false;
  },

  description: 'Stop the music.'
};