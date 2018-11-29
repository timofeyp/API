const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const schedule = require('node-schedule')
const { discordUserListSchema,reportListSchema } = require('../database/schemas/')
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


const pullUserArrFromDb = () => new Promise (async (resolve)=> {
    let userList = await requestUserFromDb()
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
        await pushUserToDb(userAdd)
        break
    case '!stop':
        let userRm = {
            discordId: message.author.id
        }
        await rmUserFromDb(userRm)
        break
    case '!srv':
        console.log("SRV!")
            let arr = await  pullUserArrFromDb({})
            processArray(arr)
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




