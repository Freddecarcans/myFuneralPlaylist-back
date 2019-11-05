const { Router } = require('express');

const router = Router();
const bodyParser = require('body-parser');


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

/* GET index page. */
router.get('/', (req, res) => {
  res.json({
    title: 'Express'
  });
});

module.exports = router;
