const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;

const connection = require('../helpers/conf');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


// Jason Web Token
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt',
    },
    ((jwtPayload, cb) => cb(null, jwtPayload))
  )
);


// en tant qu'utilisateur, je veux pouvoir consulter ma playlist
router.get('/tracks/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params;
  connection.query('SELECT idtitle, title, artist FROM titles WHERE user_id = ?', id, (err, results) => {
    if (err) {
      res.sendStatus(500);
    }
    res.json(results);
  });
});

// en tant qu'utilisateur, je veux pouvoir supprimer un morceau de ma playlist
router.delete('/tracks/:idTitle', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { idTitle } = req.params;
  connection.query('DELETE FROM titles WHERE idtitle = ?', [idTitle], (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

// en tant qu'utilisateur je veux pouvoir consulter mon compte
router.get('/profile/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM users WHERE iduser = ?', [id], (err, results) => {
    if (err) {
      res.sendStatus(500);
    }
    res.json(results);
  });
});

// en tant qu'utilisateur, je veux créer et affecter un morceau à ma playlist.
router.post('/title', passport.authenticate('jwt', { session: false }), (req, res) => {
  const form = req.body;
  connection.query('INSERT INTO titles SET ?', form, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(201);
  });
});

// en tant qu'utilisateur je veux consulter mes contacts
router.get('/contacts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params;
  connection.query('SELECT contactA, contactAName, contactAFirstName, contactB, contactBName, contactBFirstName FROM users WHERE iduser = ?', id, (err, results) => {
    if (err) {
      res.sendStatus(500);
    }
    res.json(results);
  });
});

// en tant qu'utilisateur je veux enregistrer mes contacts
router.put('/contacts/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
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
router.put('/playlists/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params;
  const form = req.body;
  connection.query('UPDATE playlist SET ? WHERE id = ?', [form, id], (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(201);
  });
});

// en tant qu'utilisateur, je veux modifier mon compte
router.put('/account/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { id } = req.params;
  const form = req.body;
  connection.query('UPDATE users SET ? WHERE iduser = ?', [form, id], (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.sendStatus(201);
  });
});


module.exports = router;
