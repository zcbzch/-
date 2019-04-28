var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/mutiple', (req, res) => {
  console.log('home')
  res.send('home')
})

router.get('/blood-sugar', (req, res) => {
  console.log('home')
  res.send('home')
});

router.get('/blood-pressure', (req, res) => {
  console.log('home')
  res.send('home')
});

module.exports = router;
