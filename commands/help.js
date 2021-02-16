const config = require('../config.json');

module.exports = {
  // The name you would use to invoke the command. Required.
  name: 'help',

  // The channel types where it could be invoked. Required.
  channelType: ['text', 'dm'],

  // Does the command needs argument(s)? Could be ignored if it's false.
  args: false,

  // The execution of the command. Required.
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    // General help
    if (!args.length) {
      data.push('Here\'s a list of all my commands:');
      data.push(commands.map(command => `* ${command.name}`).join('\n'));
      data.push(`\nYou can send \`${config.prefix}help ${this.usage}\` to get info on a specific command.`);

      // Send a dm to the user
      return message.author.send(data, { split: true })
        .then( () => {
          if (message.channel.type === 'dm') return;
          message.reply('I\'ve sent you a DM with the commands.');
        })
        .catch( (error) => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          message.reply('It seems like I can\'t DM you. Do you have DMs disabled?');
        });
    }

    // Specific command help
    const name = args[0].toLowerCase();
    const command = commands.get(name);

    if (!command) {
      return message.reply('That\'s not a valid command.');
    }

    // Creating the response.
    data.push(`**Name:** ${command.name}`);
    if (command.description) data.push(`**Description:** ${command.description}`);
    if (command.usage) data.push(`**Usage:** \`${config.prefix}${command.name} ${command.usage}\``);
    let aux = '**Channel Type:** ';
    command.channelType.forEach( (el) => {
      aux += `${el}, `;
    });
    data.push(aux.slice(0, -2));
    if (command.channels) {
      aux = '**Channel:** ';
      command.channels.forEach( (el) => {
        aux += `\`${el}\`, `;
      });
      data.push(aux.slice(0, -2));
    } else {
      aux = '**Channel:** ';
      config.channels.forEach( (el) => {
        aux += `\`${el}\`, `;
      });
      data.push(aux.slice(0, -2));
    }
    if (command.roles) {
      aux = '**Rol:** ';
      command.roles.forEach( (el) => {
        aux += `\`${el}\`, `;
      });
      data.push(aux.slice(0, -2));
    } else {
      data.push('**Rol:** `@everyone`');
    }
    data.push(`**Cooldown:** ${command.cooldown || config.cooldown} second(s)`);

    message.channel.send(data, { split: true, disableMentions: 'all' });
  },

  // What is the purpose of the command?
  description: 'List all the commands or info about a specific command',

  // What kind of argument(s) does it accept? Could be ignored in command without argument(s).
  usage: '<command-name>',

  // The roles that could invoke the command.
  roles: ['@everyone'],
  
  // The minimun time (in seconds) that a user have to wait before reusing this command. If this is ignored, the cooldown will be the default from the 'config' file.
  cooldown: 3,

  // The channels where this could be invoked. Could be ignored if 'text' is not part of the valid channel types or using the default channels in the 'config' file.
  channels: ['bot-command'],
};