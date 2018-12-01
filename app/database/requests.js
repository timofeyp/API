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
        return new Promise ((resolve) => {
            let newUser = schema(conditions)
            resolve(newUser.save(conditions, (err, list) =>{ if (err) {console.log(err)} else list} ))
        })
    },


    rmFromDb(schema, conditions) {
        return new Promise ((resolve) => {
            resolve(schema.findOneAndRemove(conditions, (err, list) =>{ if (err) {console.log(err)} else list}).exec())
        })
    }
}

module.exports = dbRqst
