module.exports = {
    name: 'prune',
    channelType: ['text'],
    args: true,
    execute(message, args) {
        message.channel.bulkDelete(args[0], true)
        .catch( (error) => {
            console.error(`Could not prune ${args[0]} messages.\n`, error);
            message.channel.send('There was an error trying to prune messages in this channel.');
        });
    },

    description: 'Prune a number of messages',
    usage: '<number>',
    roles: ['admin'],
};