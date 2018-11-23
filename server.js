const express        = require('express');
const app            = express();
const mongoose = require('./app/database')


const Discord             = require('discord.js');
const client = new Discord.Client();
client.login('NTE1NTU2MDg5NDQyMzM2Nzg4.DtnSWw.PCLGnoNwCuPG2zt6raNGykMCk5U')

client.on('message', (message)=> {
    if(message.content == 'торт') {
        message.reply('Это Я, привет')
        console.log(message.author.id)
    }
})







const bodyParser     = require('body-parser');
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));  //ДОБАВЛЯЕТ В HTTP ЗАПРОС ОБЪЕКТ
// BODY

    require('./app/routes')(app);
    app.listen(port, () => {
        console.log('We are live on ' + port);
        module.exports = mongoose
    });


