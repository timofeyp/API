/* eslint-disable no-template-curly-in-string */
const mongoose = require('mongoose')
const moment = require('moment')
const { getSettings, initializeAuth } = require('./utils/bot.js')
const Discord = require('discord.js')
const schedule = require('node-schedule')
const { DiscordUserListSchema, reportListSchema, questionsListSchema } = require('./database/schemas')
const client = new Discord.Client()
const clientStatus = { onlineStatus: false }

mongoose.connection.on('connected', async () => {
  connectBot()
})

const connectBot = async () => {
  let botSettings = await getSettings()
  if (botSettings.token.length > 15) {
    execNewSchedule(botSettings)
  }
  initializeAuth()
}

const execNewSchedule = async (botSettings) => {
  client.login(botSettings.token)
    .then(() => {
      clientStatus.onlineStatus = true
    })
    .catch(console.error)

  schedule.scheduleJob(botSettings.pollMinutes.toString() + ' ' + botSettings.pollHours.toString() + ' ? * ' + botSettings.pollDaysOfWeek, async () => {
    let arr = await DiscordUserListSchema.find({ subscribe: true })
    processArray(arr)
  })
}
module.exports = { execNewSchedule, clientStatus }

/// /////LOGIN
client.on('error', (error) => console.log(error))
client.on('disconnect', () => {
  clientStatus.onlineStatus = false
  setInterval(() => {
    do {
      connectBot()
    } while (clientStatus.onlineStatus)
  }, 30000)
})

const todayCondition = () => {
  let today = moment().startOf('day').hours(0).minutes(0)
  let tomorrow = moment(today).add(1, 'day').endOf('day').hours(0).minutes(0)
  return {
    created: {
      $gte: today.utcOffset(0, true).toDate(),
      $lt: tomorrow.utcOffset(0, true).toDate()
    }
  }
}

/// ////SCHEDULE JOB

const pollUser = (user) => new Promise(async (resolve) => {
  let botSettings = await getSettings()
  let conditions = {
    ...todayCondition(botSettings),
    author: user._id }
  let reportList = await reportListSchema.findOne(conditions)
  let reportsCheckObj = await reportsCheck(reportList)
  if (reportsCheckObj.check) {
    resolve(sendQuestion(user._id, user.discordId, (reportsCheckObj.maxReportDone + 1), reportList))
  }
})

const processArray = async (arr) => {
  for (const item of arr) {
    await pollUser(item)
  }
}

/// ////MESSAGE TREATMENT

const sendMessage = (userId, message) => new Promise((resolve) => {
  resolve(client.users.get(userId).send(message))
})

const sendQuestion = async (userId, discordUserId, questionNum, reportList) => {
  let question = await questionsListSchema.findOne({ num: questionNum })
  let questionCheckObj = await questionsCheck(reportList)
  if (question) {
    await sendMessage(discordUserId, question.text)
    if (questionCheckObj.questionDoneNum !== questionNum) {
      let conditions = {
        ...todayCondition(),
        author: userId
      }
      let update = {
        $addToSet: { questionsDone: { questionNum: questionNum, done: true, date: new Date() } },
        author: userId,
        created: new Date()
      }
      await reportListSchema.updateOne(conditions, update, { upsert: true })
    }
  } else if (question === null) {
    await sendMessage(discordUserId, 'Опрос окончен')
  }
}

const questionsCheck = async (reportList) => {
  if (reportList) {
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
      return Math.max(...getQuestionsDone())
    }
    let promiseMaxQuestionDone = () => new Promise((resolve) => {
      resolve(getMaxQuestionDone())
    })
    let questionDoneNum = await promiseMaxQuestionDone()
    let questions = await questionsListSchema.find({})
    return { check: questionDoneNum <= questions.length, questionDoneNum }
  } else {
    return { check: true, questionDoneNum: 0 }
  }
}

const reportsCheck = async (reportList) => {
  if (reportList) {
    if (reportList.reports.length) {
      let getReportsDone = () => {
        return reportList.reports.map(q => q.reportNum)
      }
      let getMaxReportsDone = () => {
        return Math.max(...getReportsDone())
      }
      let promiseMaxReportsDone = () => new Promise((resolve) => {
        resolve(getMaxReportsDone())
      })
      let maxReportDone = await promiseMaxReportsDone()
      let questions = await questionsListSchema.find({})
      return { check: reportList.reports.length < questions.length, maxReportDone }
    } else {
      return { check: true, maxReportDone: 0 }
    }
  } else {
    return { check: true, maxReportDone: 0 }
  }
}

client.on('message', async (message) => {
  if (message.author.id !== client.user.id) {
    let userCondition = { discordId: message.author.id }
    switch (message.content) {
      case '!start':
        let userAdd = {
          discordId: message.author.id,
          name: message.author.username,
          subscribe: true
        }
        await DiscordUserListSchema.updateOne(userCondition, userAdd, { upsert: true })
        break
      case '!stop':
        await DiscordUserListSchema.findOneAndUpdate(userCondition, { subscribe: false })
        break
      case 'srv':
        let arr = await DiscordUserListSchema.find({ subscribe: true })
        processArray(arr)
        break
      default:
        let user = await DiscordUserListSchema.findOne({ discordId: message.author.id })
        if (user.subscribe) {
          let conditions = {
            ...todayCondition(),
            author: user._id }
          let reportList = await reportListSchema.findOne(conditions)
          if (reportList === null) {
            sendQuestion(user._id, message.author.id, 1, reportList)
          } else {
            let reportsCheckObj = await reportsCheck(reportList)
            if (reportsCheckObj.check) {
              let update = {
                $addToSet: { reports: { reportNum: reportsCheckObj.maxReportDone + 1, text: message.content } }
              }
              await reportListSchema.updateOne(conditions, update)
            } else {
              break
            }
            await sendQuestion(user._id, message.author.id, (reportsCheckObj.maxReportDone + 2), reportList)
            break
          }
        } else {
          break
        }
    }
  }
})
