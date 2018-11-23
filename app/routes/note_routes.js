module.exports = function(app, db) {
    app.post('/notes', (req, res) => {
        const note = { text: req.body.body, title: req.body.title };
    db.collection('notes').insertOne(note, (err, result) => {
        if (err) {
            res.send({ 'error': 'An error has occurred' });
        } else {
            res.send(result.ops[0]);
}
});
});
};