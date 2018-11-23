const { addressList } = require('../database/schemas/');

module.exports = function(app) {
    app.post('/add-to-mail', (req, res) => {
        const newAddress = addressList(req.body);
        newAddress.save((err, address) => {
            if (err) {
                res.status(400).send({message: 'Create todo failed', err});
            } else {
                res.send({message: 'Todo created successfully', newAddressList: address});
            }
        })
    });




}

