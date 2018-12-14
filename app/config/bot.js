const { botSettingsSchema } = require('../database/schemas/')

const getSettings = async () => {
  const settings = await botSettingsSchema.findOne()
  return settings
}

module.exports = getSettings
