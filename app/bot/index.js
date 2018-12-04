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
        resolve(sendQuestionOne(user._id, user.discordId))
    
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

sendMessage = (userId, message) => new Promise ((resolve) => {
        resolve(client.users.get(userId).send(message))
    })

sendQuestionOne = (userId, discordUserId) => new Promise(async (resolve) => {
    await sendMessage(discordUserId, 'Вопрос 1. Это вопрос один. А почему сейчас вопрос один?')
    let report = {$addToSet: {questionsDone: {questionNum: 1, done: true, date: new Date()}}, author: userId, created: new Date()}
    await dbRqst.pushToDb(reportListSchema,  report)
    resolve()
})

sendQuestionTwo = (userId, discordUserId) => new Promise(async (resolve) => {
    console.log(userId, discordUserId)
    await sendMessage(discordUserId, 'Вопрос 2. А это уже вопрос 2. И почему вопрос два?')
    let conditions = ({ created: { $lt: Date.now() } }, {author: userId})
    let report = {
        questionsDone: {$push: {questionId: 2, done: true, date: new Date()}}
    }
    await dbRqst.findOneAndUpdate(reportListSchema, conditions, report)
    resolve()
})

sendQuestionThree = (userId, discordUserId) => new Promise(async (resolve) => {
    console.log(userId, discordUserId)
    await sendMessage(discordUserId, 'Вопрос 3. Неужели три?')
    let conditions = ({ created: { $lt: Date.now() } }, {author: userId})
    let report = {
        questions: true
    }
    await dbRqst.findOneAndUpdate(reportListSchema, conditions, report)
    resolve()
})




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
            break
        default:
            let user = await dbRqst.pullFromDb(discordUserListSchema,  {discordId: message.author.id})
            console.log(user[0]._id)
            
            if (user.length) {
                let conditions = { created: { $lt: Date.now() }, author: user[0]._id}
                let reportList = await dbRqst.pullFromDb(reportListSchema, conditions)
                console.log(reportList + " - reportList")
    
                let getQuestionsDone = () => {
                    if (reportList.length === 0 ) {
                        return [0]
                    } else {
                        return reportList[0].questionsDone.map(q => {
                            if (q.done) {
                                return q.questionNum
                            }
                        })
                    }
                }
                let getMinQuestion = () => {
                    return Math.min(...getQuestionsDone());
                }

                let promiseQuestion = () => new Promise ((resolve)=> {
                    resolve(getMinQuestion())
                })

                let minimumQuestionDone = await promiseQuestion()
    
                console.log(minimumQuestionDone)
                
                if (reportList.length === 0 ) {
                        sendQuestionOne(user[0]._id, message.author.id)
                } else if (reportList[0].questionOne) {
                    
                        sendQuestionTwo(user[0]._id, message.author.id)
                } else if (reportList[0].questionTwo) {
                        sendQuestionThree(user[0]._id, message.author.id)
                } else if (reportList[0].questionThree) {
                    break
                }
            } else {
                break
            }
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




