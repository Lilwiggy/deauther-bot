const data = require('./data.json');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort(data.port, {
  baudRate: 115200,
  parser: SerialPort.parsers.readline,
});
const parser = new Readline();
const Discord = require('discord.js');
const client = new Discord.Client();
let channel;
// For buffering data
let results = '';
let lastPacket = new Date();
// Makes the data readable by a human
port.pipe(parser);

port.on('open', () => {
  console.log(`Connected to ESP8266!`);
});

client.on('message', (message) => {
  if (message.author.bot)
    return;

  // Getting the channel object for later use
  channel = message.channel;

  // Ignores messages that don't start with the prefix
  if (message.content.startsWith(data.prefix)) {
    port.write(message.content.slice(data.prefix.length), (err) => {
      if (err)
        message.channel.send(err.message);
    });
  }
});


parser.on('data', (res) => {
  results += `${res}\n`;
  lastPacket = new Date();
});


port.on('error', (err) => {
  console.log(`I ran into an error!\n${err}`);
});

client.on('ready', () => {
  console.log(`Connected to Discord!`);
});

client.login(data.token).catch((err) => {
  console.log(`I had an error logging into discord. \nPlease be sure you entered your token in setup!\n\n${err}`);
});

// Checks if the buffer is finished sending information
setInterval(() => {
  let now = new Date();
  if (results.length > 0 && now.getMilliseconds() - lastPacket.getMilliseconds() >= 500) {
    send(results);
    results = '';
  }
}, 100);


function send(input) {
  return channel.send(input, { code: `js`, split: true });
}
