//const TelegramBot = require("node-telegram-bot-api")
var TelegramBot= require('node-telegram-bot-api');
var token ='1627536932:AAG8xwoZKApq79u5C6WTIKgjD_370D06tfg';
var bot =new TelegramBot(token,{polling:true});
bot.onText(/\/echo (.+)/,function(msg,match))