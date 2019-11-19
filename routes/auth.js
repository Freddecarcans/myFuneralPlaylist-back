
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;

const connection = require('../helpers/conf');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Route avec verification mot de passe

passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  }, ((email, password, done) => {
    connection.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      (err, user) => {
        // si une erreur est obtenue

        if (!bcrypt.compareSync(password, user[0].password, 10)) {
          return done(null, false, { message: 'Incorrect username or password' });
        }
        // si utilisateur ok on retourne l'objet user

        return done(null, { iduser: user[0].iduser, email: user[0].email, username: user[0].username });
      }
    );
  })
));

// Jason Web Token
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'plop',
    },
    ((jwtPayload, cb) => cb(null, jwtPayload))
  )
);

// route enregistrement et cryptage mot de passe

router.post('/signup', (req, res) => {
  const user = {
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  connection.query('INSERT INTO users SET ?', user, (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

// Route connexion avec authentification

router.post('/signin', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.sendStatus(500);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    const token = jwt.sign(user, 'myfuneralplaylist');
    return res.json({
      username: user.username, token, iduser: user.iduser, email: user.email
    });
  })(req, res);
});

router.get('/email/:email', (req, res) => {
  const { email } = req.params;
  connection.query('SELECT iduser FROM users WHERE email = ?', email, (err, results) => {
    if (err) {
      res.sendStatus(500);
    }
    res.json(results);
  });
});

module.exports = router;
