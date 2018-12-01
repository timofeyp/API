const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const schedule = require('node-schedule')
const { discordUserListSchema,reportListSchema } = require('../database/schemas/')
const dbRqst = require('../database/requests')
const client = new Discord.Client()


    ///////////////// LOGIN
client.login(token)


///////SCHEDULE JOB

const pollUser = (user) => new Promise(resolve=>{
        resolve(client.users.get(user.discordId).send('HIHIHI'))
})

const awaitPollUser = async (item) => {
    await pollUser(item)
}

const processArray = async (arr)=> {
    for (const item of arr) {
        await awaitPollUser(item)
    }
}

schedule.scheduleJob('50 15 ? * 1-6', async ()=> {
    let arr = await  dbRqst.pullFromDb(discordUserListSchema, {})
    processArray(arr)
})


///////MESSAGE TREATMENT

client.on('message', async (message)=> {
    if (message.author.id !== client.user.id) {
    switch (message.content) {
        case '!start':
            let userAdd = {
                discordId: message.author.id,
                name: message.author.username
            }
            await dbRqst.pushToDb(discordUserListSchema, userAdd)
            break
        case '!stop':
            let userRm = {
                discordId: message.author.id
            }
            await dbRqst.rmFromDb(discordUserListSchema, userRm)
            break
        case 'srv':
            let arr = await dbRqst.pullFromDb(discordUserListSchema, {})
            processArray(arr)
        
            // let rq = await dbRqst.pullFromDb(discordUserListSchema,  {
            //     discordId: message.author.id
            // })
            // let mes = {
            //     author: rq[0].id,
            //     reportOne: {body: message.content}
            // }
            // dbRqst.pushToDb(reportListSchema,  mes)
            //       console.log(mes)
            break
        default:
          //  let user= await dbRqst.findOneFromDb(discordUserListSchema, { day: { $lt: Date.now() } })
            let reportList = await dbRqst.pullFromDb(reportListSchema, { created: { $lt: Date.now() } })
            console.log(reportList)
    }
}
})


// schedule.scheduleJob('17 13 ? * 1-6', async ()=> {
// let userArr = await dbRqst.pullFromDb(discordUserListSchema, {})
// console.log(userArr.find(user => user.discordId === message.author.id))
//         let arr = await  pullUserArrFromDb
//         console.log(arr)
//         arr.forEach((user) => {
//             (()=>setInterval(()=>console.log("3"),2000))()
//            // ((user)=> client.users.get(user.discordId).send('HIHIHI'))(user)
//         })
//     })




