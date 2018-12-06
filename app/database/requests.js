const dbRqst = {
    pullFromDb(schema, conditions) {
         return new Promise ((resolve) => {
            resolve(schema.find(conditions, (err, list) => list ).exec())
        })
    },

    findOne(schema, conditions) {
        return new Promise ((resolve) => {
          //  console.log(schema)
            resolve(schema.findOne(conditions, (err, list) => list ).exec())
        })
    },


    updateOne(schema, filter, update, options) {
        return new Promise (async (resolve) => {
        
       //     let newUser = schema(filter)
            let updateUser = await schema.updateOne(filter, update, options, (err, list) =>{ if (err) {console.log(err)} else list} )
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
