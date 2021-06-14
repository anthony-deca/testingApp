var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.send('Resume Backend Devs are the best in the whole wide world, yeah', );
});

module.exports = router;
