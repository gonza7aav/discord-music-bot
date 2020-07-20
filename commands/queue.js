const config = require('../config.json');

module.exports = {
    name: 'queue',
    channelType: ['text'],
    args: true,

    execute(message, args, musicPlayer) {
        // Control the playlist limit in the 'config' file.
        if (musicPlayer.playlist.length < config.playlistLimit) {
            let url = args[0];
            musicPlayer.playlist.push(url);
        } else {
            message.reply('The playlist is full. Try again after this song.');
        }
    },

    description: 'Add the song to the playlist.',
    usage: '<url>'
};