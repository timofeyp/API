const { botSettingsSchema } = require('../database/schemas/')

getSettings = async () => {
  const settings = await botSettingsSchema.findOne()
  return settings
}

module.exports = getSettings
