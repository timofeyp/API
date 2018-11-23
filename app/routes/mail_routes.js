module.exports = function(app, db) {
    app.post('/add-to-mail', (req, res) => {
        const mail = { name: req.body.name, mail: req.body.mail };
    db.collection('mail').insertOne(mail, (err, result) => {
        if (err) {
            res.send({ 'error': 'An error has occurred' });
        } else {
            res.send(result.ops[0]);
}
});
});
    app.post('/rm-from-mail', (req, res) => {
        const mail = { name: req.body.name, mail: req.body.mail };
        db.collection('mail').deleteOne(mail, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

};