const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const { discordUserListSchema } = require('../database/schemas/')
const client = new Discord.Client()
let userArrFromDb = []

client.login(token)

pullUserArrFromDb = async ()=> {
        await discordUserListSchema.find((err, list)=> {
        list.forEach( (user)=> {
            userArrFromDb.push(
                {
                    discordId: user.discordId,
                    name: user.name
                })
        })
    })
}

pushUserToDb = ()=> {
    for (user of client.users){
        if (user[1].bot || userArrFromDb.find(x => x.discordId === user[1].id)) continue
        else
            ((user) => {
                const userObj = {
                    discordId: user[1].id,
                    name: user[1].username
                }
                const discordUser = discordUserListSchema(userObj)
                discordUser.save((err, address) => {
                    if (err) {
                        console.warn({message: 'Add user failed', err})
                    } else {
                        console.log({message: 'User add successfully', newAddressList: address})
                    }
                })
            })(user)
    }
}

client.on('ready', () => {
    setInterval ( async () => {
        await pullUserArrFromDb()
        pushUserToDb()
    }, discordUserListUpdateTime)})



client.on('message', (message)=> {
    if(message.content == 'Привет') {
        message.reply('Это Я, привет')
        console.log(message.author)
        console.log(client.users.get('470327455283150869').send("HIHIHI"))
    }
})

setInterval(  async () => {
    const d = new Date();
    if (d.getHours() == votingTimeHrs && d.getMinutes() == votingTimeMns) {
        console.log("1")
        userArrFromDb = []
        await   pullUserArrFromDb()
        console.log("2")
        console.log(userArrFromDb)
        userArrFromDb.forEach((user) => {
            client.users.get(user.discordId).send('HIHIHI')
        })
    }
}, 10000)
