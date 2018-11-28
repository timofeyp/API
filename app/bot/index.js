const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const schedule = require('node-schedule');
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



const pollUser = (user) => new Promise(resolve=>{
        client.users.get(user.discordId).send('HIHIHI')
        resolve()
})

const awaitPollUser = async (item) => {
    await pollUser(item)
    console.log(item)
}

const processArray = async (arr)=> {
    for (const item of arr) {
        await awaitPollUser(item)
    }
}
schedule.scheduleJob('05 19 ? * 1-6', async ()=> {
    let arr = await  pullUserArrFromDb
    console.log(arr)
    processArray(arr)
})




// schedule.scheduleJob('17 13 ? * 1-6', async ()=> {
//         let arr = await  pullUserArrFromDb
//         console.log(arr)
//         arr.forEach((user) => {
//             (()=>setInterval(()=>console.log("3"),2000))()
//            // ((user)=> client.users.get(user.discordId).send('HIHIHI'))(user)
//         })
//     })



// client.on('message', (message)=> {
//     if(message.content == 'Привет') {
//         message.reply('Это Я, привет')
//         console.log(message.author)
//         console.log(client.users.get('470327455283150869').send("HIHIHI"))
//     }
// })
