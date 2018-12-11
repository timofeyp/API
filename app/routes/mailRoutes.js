const { addressList } = require('../database/schemas/');

module.exports = function(app) {
    app.post('/add-mail', (req, res) => {
        const newAddress = addressList(req.body);
        newAddress.save((err, address) => {
            if (err) {
                res.status(400).send({message: 'Create mail address failed', err});
            } else {
                res.send({message: 'Mail address created successfully', newAddressList: address});
            }
        })
    });
    app.post('/rm-mail', (req, res) => {
        addressList.findByIdAndRemove(req.body.id,(err, address) => {
            if (err) {
                res.status(400).send({message: 'Delete mail address failed', err});
            } else {
                res.send({message: 'Mail address deleted successfully', newAddressList: address});
            }
        })
    });
}

