const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../helpers/conf');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// en tant qu'utilisateur, je veux pouvoir consulter ma playlist
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT idtitle, title, artist FROM titles WHERE user_id = ?', id, (err, results) => {
    if (err) {
      res.sendStatus(500);
    }
    res.json(results);
  });
});

module.exports = router;
