const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const schedule = require('node-schedule')
const { discordUserListSchema,reportListSchema } = require('../database/schemas/')
const dbRqst = require('../database/requests')
const client = new Discord.Client()


    ///////////////// LOGIN
client.login(token)


const userArrFromDb = []
const pullUserArrFromDb = () => new Promise (async (resolve)=> {
    let userList = await rqst.pullFromDb(discordUserListSchema, {})
    userList.forEach((user)=> {
        userArrFromDb.push(
            {
                discordId: user.discordId,
                name: user.name,
                voteOne: {answer: false, response:false },
                voteTwo: {answer: false, response:false },
                voteThree: {answer: false, response:false }
            })
    })
 resolve(userArrFromDb)
})


const pollUserVoteOne = () => new Promise ((resolve)=> {

})



///////SCHEDULE JOB

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

schedule.scheduleJob('50 15 ? * 1-6', async ()=> {
    let arr = await  pullUserArrFromDb({})
    processArray(arr)
})


///////MESSAGE TREATMENT

client.on('message', async (message)=> {
    let user = userArrFromDb.find(user => user.discordId === message.author.id)
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
    case '!srv':
        console.log("SRV!")
            let arr = await  pullUserArrFromDb({})
            processArray(arr)
        let rq = await dbRqst.pullFromDb(discordUserListSchema,  {
            discordId: message.author.id
        })
              console.log(rq)
        break
    default:
        switch (userArrFromDb) {
            case (userArrFromDb): {
                break
            }
        }
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




