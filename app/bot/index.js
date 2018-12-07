const moment = require('moment')
const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const schedule = require('node-schedule')
const { discordUserListSchema, reportListSchema, questionsListSchema } = require('../database/schemas/')
const dbRqst = require('../database/requests')
const client = new Discord.Client()


    ///////////////// LOGIN
client.login(token)
client.on('error: ', console.error)

///////SCHEDULE JOB

const pollUser = (user) => new Promise(resolve=>{
        resolve(sendQuestion(user._id, user.discordId, 1))
    
})

const awaitPollUser = async (item) => {
    await pollUser(item)
}

const processArray = async (arr)=> {
    for (const item of arr) {
        await pollUser(item)
    }
}

schedule.scheduleJob('02 19 ? * 1-6', async ()=> {
    let arr = await  dbRqst.pullFromDb(discordUserListSchema, {})
    processArray(arr)
})


///////MESSAGE TREATMENT

sendMessage = (userId, message) => new Promise ((resolve) => {
        resolve(client.users.get(userId).send(message))
    })

sendQuestion = (userId, discordUserId, questionNum) => new Promise(async (resolve) => {
    let question = await dbRqst.findOne(questionsListSchema, {num: questionNum})
    console.log(question)
    if (question) {
        await sendMessage(discordUserId, question.text)
        let today = moment().startOf('day')
        let tomorrow = moment(today).endOf('day')
        let conditions = {  created: {
                $gte: today.toDate(),
                $lt: tomorrow.toDate()
            }, author: userId}
        let update = {
            $addToSet: {questionsDone: {questionNum: questionNum, done: true, date: new Date()}},
            author: userId,
            created: new Date()
        }
       await dbRqst.updateOne(reportListSchema,conditions,update ,{ upsert: true} )
    } else if (question === null) {
        await sendMessage(discordUserId, 'Опрос окончен')
    }
    
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
            await dbRqst.updateOne(discordUserListSchema, userAdd)
            break
        case '!stop':
            let userRm = {
                discordId: message.author.id
            }
            await dbRqst.findOneAndRemove(discordUserListSchema, userRm)
            break
        case 'srv':
            break
        default:
            let user = await dbRqst.pullFromDb(discordUserListSchema,  {discordId: message.author.id})
            if (user.length) {
                let today = moment().startOf('day')
                let tomorrow = moment(today).endOf('day')
                let conditions = {  created: {
                        $gte: today.toDate(),
                        $lt: tomorrow.toDate()
                    }, author: user[0]._id}
                let reportList = await dbRqst.findOne(reportListSchema, conditions)
                if (reportList === null  ) {
                        sendQuestion(user[0]._id, message.author.id, 1)
                } else  {

                    let getQuestionsDone = () => {
                            return reportList.questionsDone.map(q => {
                                if (q.done) {
                                    return q.questionNum
                                } else {
                                    return 0
                                }
                            })
                    }
                    let getMaxQuestionDone = () => {
                        return Math.max(...getQuestionsDone());
                    }
                    let promiseMaxQuestionDone = () => new Promise ((resolve)=> {
                        resolve(getMaxQuestionDone())
                    })
                    let questionNum = await promiseMaxQuestionDone()
                    await sendQuestion(user[0]._id, message.author.id, (questionNum + 1))
                    let update = {
                        $addToSet: {reports: {reportNum: questionNum, text: message.content}}
                    }
                    await dbRqst.updateOne(reportListSchema,conditions,update)
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




