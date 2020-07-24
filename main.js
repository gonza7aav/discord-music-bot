const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

// The responsible object of the music in the voice channel.
var musicPlayer = {
    // Represents a connection to a guild's voice server.
    // See more in https://discord.js.org/#/docs/main/v12/class/VoiceConnection
    connection: false,

    // The class that sends voice packet data to the voice connection.
    // See more in https://discord.js.org/#/docs/main/v12/class/StreamDispatcher
    dispatcher: false,

    // An array of YouTube's URLs to be played next.
    playlist: [],

    // The actual volume.
    volume: config.volume / 100,

    // The actual quality.
    quality: config.quality
};

client.login(config.token);

client.on('ready', () => {
    console.log(`bot ${client.user.tag} is ready.`);
});

// Scan all the command's files in 'commands' folder.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Set the commands to a Collection.
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', async message => {

    // Focus in message that start with the prefix from non bots members.
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  
    // Get the command and arguments from the message.
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // if it isn't a valid command, it won't continue.
    if (!client.commands.has(commandName)) {
        message.reply(`I can't find the \`${commandName}\` command.`);
        return;
    }

    // Get the command from the Collection.
    const command = client.commands.get(commandName);

    // Control if the author has the role to use the command.
    if (command.roles && message.channel.type != 'dm') {
        if (!message.member.roles.cache.some(role => command.roles.includes(role.name))) {
            message.reply(`You don't have the rol to use \`${commandName}\` command.`);
            return;
        }
    }

    // Control the channel type admitted by the command.
    if (!command.channelType.includes(message.channel.type)) {
        let reply = `I can't execute \`${command.name}\` command here.\nIt's supposed to be used in `;
        command.channelType.forEach( (el) => {
            reply += `${el}, `;
        });
        reply = reply.slice(0, -2) + ' channel(s).';
        message.reply(reply);
        return;
    }

    // Control the scope (default or specific) for the command.
    if (message.channel.type === 'text') {
        let auxChannels = config.channels;
        if (command.channels) auxChannels = command.channels;

        if (!auxChannels.includes(message.channel.name)) {
            let reply = `The \`${command.name}\` command can only be used in `;
            auxChannels.forEach( (el) => {
                reply += `\`${el}\`, `;
            });
            reply = reply.slice(0, -2) + ' channel(s).';

            message.reply(reply);
            return;
        }
    }

    // Reply for commands with required arguments that wasn't provided.
    if (command.args && !args.length) {
        let reply = 'you didn\'t provide any arguments.';

        // Comment the usage if it's available.
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\`.`;
        }
      
        return message.reply(reply);
    }
  
    // Create a Collection for each command with the last (1) use of it.
    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Discord.Collection());
    }
  
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || config.cooldown) * 1000;
  
    // Control the last use of a command by a member.
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            return;
        }
    } else {
        // (1) last use before the cooldown time expires. After that, the record of use by the member is deleted.
        timestamps.set(message.author.id, now);
        setTimeout( () => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args, musicPlayer);
    } catch (error) {
        console.error(`There was an error trying to execute ${commandName}.\n`, error);
        message.reply('There was an error trying to execute that command.');
    }
  
});