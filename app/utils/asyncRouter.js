const methods = require('http').METHODS

const wrapAsync = fn => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (err) {
    next(err)
  }
}

const asyncRouter = app => {
  methods.forEach(m => {
    const original = app[m.toLowerCase()]
    /* eslint-disable no-param-reassign */
    app[m.toLowerCase()] = (...args) => {
      const wrappedArgs = args.map(arg => {
        if (typeof arg === 'function') {
          return wrapAsync(arg)
        }
        return arg
      })
      return original.call(app, ...wrappedArgs)
    }
  })
  return app
}

module.exports = asyncRouter
