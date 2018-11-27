const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const { discordUserListSchema } = require('../database/schemas/')
const client = new Discord.Client()

client.login(token)

const requestToDb = discordUserListSchema.find((err, list) => list )
const pullUserArrFromDb = new Promise (async (resolve)=> {
    let list = await requestToDb
    let userArrFromDb = []
    list.forEach((user)=> {
        userArrFromDb.push(
            {
                discordId: user.discordId,
                name: user.name
            })
    })
 resolve(userArrFromDb)
})


setInterval(  async () => {
    const d = new Date();
    if (d.getHours() == votingTimeHrs && d.getMinutes() == votingTimeMns) {
        let arr = await  pullUserArrFromDb
        console.log(arr)
        arr.forEach((user) => {
            client.users.get(user.discordId).send('HIHIHI')
        })
    }
}, 10000)




// client.on('message', (message)=> {
//     if(message.content == 'Привет') {
//         message.reply('Это Я, привет')
//         console.log(message.author)
//         console.log(client.users.get('470327455283150869').send("HIHIHI"))
//     }
// })
