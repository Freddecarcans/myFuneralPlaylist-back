const express = require('express');
const bodyParser = require('body-parser');
const connection = require('../helpers/conf');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// en tant qu'utilisateur, je veux pouvoir consulter ma playlist
router.get('/:id/tracks', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT idtitle, title, artist FROM titles WHERE user_id = ?', id, (err, results) => {
    if (err) {
      res.sendStatus(500);
    }
    res.json(results);
  });
});
// en tant qu'utilisateur, je veux pouvoir supprimer un morceau de ma playlist
router.delete('/:idUser/tracks/:idTitle', (req, res) => {
  const { idUser, idTitle } = req.params;
  connection.query('DELETE FROM titles WHERE user_id = ? AND idtitle = ?', [idUser, idTitle], (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

// en tant qu'utilisateur je veux pouvoir consulter mon compte
router.get('/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT name, firstname, email, contactA, contactB, iduser FROM users WHERE iduser = ?', id, (err, results) => {
    if (err) {
      res.sendStatus(500);
    }
    res.json(results);
  });
});
// en tant qu'utilisateur, je veux créer et affecter un morceau à une playlist.
router.post('/title', (req, res) => {
  const form = req.body;
  connection.query('INSERT INTO titles SET ?', form, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(201);
  });
});
// en tant qu'utilisateur je veux consulter mes contacts
router.get('/:id/contact', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT contactA, contactB FROM users WHERE iduser = ?', id, (err, results) => {
    if (err) {
      res.sendStatus(500);
    }
    res.json(results);
  });
});
// en tant qu'utilisateur je veux enregistrer mes contacts
router.put('/:id/contact', (req, res) => {
  const { id } = req.params;
  const form = req.body;

  connection.query('UPDATE users SET ? WHERE iduser = ?', [form, id], (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(201);
  });
});

// en tant qu'utilisateur, je veux pouvoir modifier une playlist.
router.put('/playlists/:id', (req, res) => {
  const { id } = req.params;
  const form = req.body;
  connection.query('UPDATE playlist SET ? WHERE id = ?', [form, id], (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(201);
  })
});

module.exports = router;
