const { discordUserList } = require('../database/schemas/')

module.exports = function(app) {
    app.post('/add', (req, res) => {
        const newAddress = discordUserList(req.body);
        newAddress.save((err, address) => {
            if (err) {
                res.status(400).send({message: 'Create mail address failed', err});
            } else {
                res.send({message: 'Mail address created successfully', newAddressList: address});
            }
        })
    });
}
