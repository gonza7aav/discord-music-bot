module.exports = {
    name: 'marco',
    channelType: ['text', 'dm'],
    execute(message, args) {
        message.channel.send('polo');
    },
    description: 'Marco Polo',
};