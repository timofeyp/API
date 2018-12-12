const { botSettingsSchema } = require('../database/schemas/')

getSettings = async () => {
  return await botSettingsSchema.findOne({})
}

module.exports = getSettings()
