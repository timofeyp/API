const botCfg = require('../config/bot')
const Discord             = require('discord.js')
const { discordUserList } = require('../database/schemas/')
const client = new Discord.Client()
const userArrFromDb = []

client.login(botCfg.token)



client.on('ready', () => {
    setInterval (function (){
            discordUserList.find(  (err, list)=> {
                list.forEach( (user)=> {
                    userArrFromDb.push(
                        {
                            discordId: user.discordId,
                            name: user.name,
                        })
                })
            })
                .then(()=>{
                    for (user of client.users){
                        if (user[1].bot || userArrFromDb.find(x => x.discordId === user[1].id)) continue
                        else
                        ((user) => {
                            const userObj = {
                                discordId: user[1].id,
                                name: user[1].username
                            }
                            const discordUser = discordUserList(userObj)
                            discordUser.save((err, address) => {
                                if (err) {
                                    console.warn({message: 'Add user failed', err});
                                } else {
                                    console.log({message: 'User add successfully', newAddressList: address});
                                }
                            })
                        })(user)
                    }
                })
    }, botCfg.discordUserListUpdateTime);});



client.on('message', (message)=> {
    if(message.content == 'Привет') {
        message.reply('Это Я, привет')
        console.log(message.author.id)
        console.log(client.users.get('470327455283150869').send("HIHIHI"))
    }
})
