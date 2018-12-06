const dbRqst = {
    pullFromDb(schema, conditions) {
         return new Promise ((resolve) => {
            resolve(schema.find(conditions, (err, list) => list ).exec())
        })
    },

    findOne(schema, conditions) {
      // console.log("SCHEMA:  " + schema,"CONDITIONS:  " +  conditions)
        return new Promise ((resolve) => {
            console.log(schema)
            resolve(schema.findOne(conditions, (err, list) => list ).exec())
        })
    },


    updateOne(schema, filter, update, options) {
        return new Promise (async (resolve) => {
            console.log('asdas')
            let newUser = schema(conditions)
            let updateUser = await newUser.updateOne(conditions, doc, options, (err, list) =>{ if (err) {console.log(err)} else list} )
            resolve(updateUser)
        })
    },


    findOneAndRemove(schema, conditions) {
        return new Promise ((resolve) => {
            resolve(schema.findOneAndRemove(conditions, (err, list) =>{ if (err) {console.log(err)} else list}).exec())
        })
    },
    
    findOneAndUpdate(schema, conditions, update) {
        return new Promise ((resolve) => {
            resolve(schema.findOneAndUpdate(conditions, update, (err, list) =>{ if (err) {console.log(err)} else list}).exec())
        })
    },
}

module.exports = dbRqst
