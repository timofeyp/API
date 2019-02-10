const { botSettingsSchema, AdminUserList } = require('../database/schemas')
const  botAuth  = require('../config/bot.json')

const initializeAuth = async () => {
  const authData = await AdminUserList.findOne()
  if (!authData) {
    var firstAdminUser = new AdminUserList({
      username: botAuth.sysLogin,
      password: botAuth.sysPass
    })
    await firstAdminUser.save({ username: botAuth.sysLogin, password: botAuth.sysPass })
  }
}

const getSettings = async () => {
  let settings = await botSettingsSchema.findOne()
  if (!settings) {
    settings = await botSettingsSchema.findOneAndUpdate({}, { pollHours: 0, pollMinutes: 0, pollDaysOfWeek: ' ', token: botAuth.discordToken }, { upsert: true, returnNewDocument: true },
      (err, documents) => {
        settings = documents
        return documents
      })
  }
  return settings
}

module.exports = { getSettings, initializeAuth }
