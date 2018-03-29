const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const fs = require('fs');
const info = require('./data.json');

rl.question(`What is your bot's token?\n`, (token) => {
  info.token = token;
  rl.question(`What port is your ESP8266 on?\n`, (port) => {
    info.port = port;
    rl.question(`What do you want the bot prefix to be?\nIf you want a mention just say mention.\n`, (prefix) => {
      info.prefix = prefix;
      fs.writeFile('./data.json', JSON.stringify(info), 'utf8', () => {
        console.log(`Updated your info! Please enjoy the bot :)`);
      });
      rl.close();
    });
  });
});

