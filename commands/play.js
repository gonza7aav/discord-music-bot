const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    channelType: ['text'],

    async execute(message, args, musicPlayer) {
        if (!musicPlayer.connection) return message.reply('I need to be in a voice channel. You can use `!join`.');

        let url;
        // Play the queue.
        if (!args.length) {
            if (musicPlayer.playlist.length) {
                url = musicPlayer.playlist.shift();
            } else {
                message.channel.send('The playlist is empty.');
                return;
            }
        } else {
            // Play an specific song.
            url = args[0];
        }

        musicPlayer.dispatcher = musicPlayer.connection.play(ytdl(url, { filter: 'audioonly', quality: musicPlayer.quality }), { volume: musicPlayer.volume });

        musicPlayer.dispatcher.on('finish', () => {
            // Play the next song in the playlist.
            this.execute(message, [], musicPlayer);
        });
    },

    description: 'Play the music of a YouTube video.',
    usage: '<url>'
};