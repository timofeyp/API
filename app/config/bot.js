const { botSettingsSchema } = require('../database/schemas/')

const getSettings = async () => {
  const settings = await botSettingsSchema.findOne()
  if (!settings) {
    await botSettingsSchema.updateOne({}, { pollHours: 0, pollMinutes: 0, pollDaysOfWeek: ' ', token: ' ' }, { upsert: true })
  }
  return settings
}

module.exports = getSettings
