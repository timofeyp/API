const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const schedule = require('node-schedule');
const { discordUserListSchema } = require('../database/schemas/')
const client = new Discord.Client()
    ///////////////// LOGIN
client.login(token)


const userArrFromDb = []
const requestUserFromDb = (conditions) => new Promise ((resolve) => {
    resolve(discordUserListSchema.find(conditions, (err, list) => list ).exec())
})

const pushUserToDb = (conditions) => new Promise ((resolve) => {
    let newUser = discordUserListSchema(conditions)
    resolve(newUser.save(conditions, (err, list) =>{ if (err) {console.log(err)} else list} ))
})

const rmUserFromDb = (conditions) => new Promise ((resolve) => {
    resolve(discordUserListSchema.findOneAndRemove(conditions, (err, list) =>{ if (err) {console.log(err)} else list}).exec())
})



requestUserFromDb({}).then(x=> console.log(x))

const pullUserArrFromDb = () => new Promise (async (resolve)=> {
    let list = await requestUserFromDb
    let userArrFromDb = []
    list.forEach((user)=> {
        userArrFromDb.push(
            {
                discordId: user.discordId,
                name: user.name,

            })
        console.log("111111")
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
schedule.scheduleJob('48 14 ? * 1-6', async ()=> {
    let arr = await  pullUserArrFromDb({})
    console.log(arr)
    processArray(arr)
})

client.on('message', async (message)=> {
   // let user = userArrFromDb.find(user => user.discordId === message.author.id)
    switch (message.content) {
    case '!start':
        let userAdd = {
            discordId: message.author.id,
            name: message.author.username
        }
        await pushUserToDb(userAdd)
        break;
    case '!stop':
        let userRm = {
            discordId: message.author.id
        }
        await rmUserFromDb(userRm)
        break;
    case 5:
        console.log(5)
        break;
    default:
        console.log("DEFAULT!")
}
})


// schedule.scheduleJob('17 13 ? * 1-6', async ()=> {
//         let arr = await  pullUserArrFromDb
//         console.log(arr)
//         arr.forEach((user) => {
//             (()=>setInterval(()=>console.log("3"),2000))()
//            // ((user)=> client.users.get(user.discordId).send('HIHIHI'))(user)
//         })
//     })




