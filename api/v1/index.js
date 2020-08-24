let express = require('express')
let router = express.Router()
let { userController } = require('./controller/user')

router.get('/test', userController.test)
router.get('/login', function (req, res) { res.send('from login') })

module.exports = router