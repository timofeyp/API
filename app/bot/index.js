const moment = require('moment')
const {token, discordUserListUpdateTime, votingTimeHrs, votingTimeMns} = require('../config/bot')
const Discord             = require('discord.js')
const schedule = require('node-schedule')
const { discordUserListSchema, reportListSchema, questionsListSchema } = require('../database/schemas/')
const client = new Discord.Client()


    ///////////////// LOGIN
client.login(token)
client.on('error: ', console.error)


const todayCondition = () => {
    let today = moment().startOf('day')
    let tomorrow = moment(today).endOf('day')
    return {
        created: {
            $gte: today.toDate(),
            $lt: tomorrow.toDate()
        }
    }
}

///////SCHEDULE JOB

const pollUser = (user) => new Promise(resolve=>{
        resolve(sendQuestion(user._id, user.discordId, 1))
})

const processArray = async (arr)=> {
    for (const item of arr) {
        await pollUser(item)
    }
}

schedule.scheduleJob('02 19 ? * 1-6', async ()=> {
    let arr = await  discordUserListSchema.find({})
    processArray(arr)
})


///////MESSAGE TREATMENT

const sendMessage = (userId, message) => new Promise ((resolve) => {
        resolve(client.users.get(userId).send(message))
    })

const sendQuestion = (userId, discordUserId, questionNum) => new Promise(async (resolve) => {
    let question = await questionsListSchema.findOne({num: questionNum})
    console.log(question)
    if (question) {
        await sendMessage(discordUserId, question.text)
        let conditions = {  ...todayCondition()
            , author: userId}
        let update = {
            $addToSet: {questionsDone: {questionNum: questionNum, done: true, date: new Date()}},
            author: userId,
            created: new Date()
        }
       await reportListSchema.updateOne(conditions,update ,{ upsert: true} )
    } else if (question === null) {
        await sendMessage(discordUserId, 'Опрос окончен')
    }

    resolve()
})



client.on('message', async (message)=> {
    if (message.author.id !== client.user.id) {
        let userCondition = {discordId: message.author.id}
        switch (message.content) {
        case '!start':
            let userAdd = {
                discordId: message.author.id,
                name: message.author.username,
                subscribe: true
            }
            await discordUserListSchema.updateOne(userCondition, userAdd, {upsert: true})
            break
        case '!stop':
            await discordUserListSchema.findOneAndUpdate(userCondition, {subscribe: false})
            break
        case 'srv':
            let arr = await  discordUserListSchema.find({subscribe: true})
            console.log(arr)
            break
        default:
            let user = await discordUserListSchema.find({discordId: message.author.id})
            if (user.subscribe) {
                let conditions = {
                    ...todayCondition(),
                    author: user[0]._id}
                let reportList = await reportListSchema.findOne(conditions)
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
                    await reportListSchema.updateOne(conditions,update)
                    break
                }
            } else {
                break
            }
    }
}
})





