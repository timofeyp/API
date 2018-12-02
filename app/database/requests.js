const dbRqst = {
    pullFromDb(schema, conditions) {
         return new Promise ((resolve) => {
            resolve(schema.find(conditions, (err, list) => list ).exec())
        })
    },
    
    findOneFromDb(schema, conditions) {
        return new Promise ((resolve) => {
            resolve(schema.findOne(conditions, (err, list) => list ).exec())
        })
    },
    
    
    pushToDb(schema, conditions) {
        return new Promise (async (resolve) => {
            console.log('asdas')
            let newUser = schema(conditions)
            let updateUser = await newUser.updateOne(conditions, {upsert: true}, (err, list) =>{ if (err) {console.log(err)} else list} )
            resolve(updateUser)
        })
    },


    rmFromDb(schema, conditions) {
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
