const express = require('express');
const controller = require('../server/controller')


const router = express.Router();
//router.get('/users', )
router.post('/', controller.createUsers )

module.exports = router;