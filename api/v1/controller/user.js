let async = require('async')

let userController = {};

userController.test = (req, res) => {
    async.waterfall([
        (nextCall) => {
            nextCall(null)
        }
    ], (error, result) => {
        error ? res.json({
            error: 'error occured'
        }) : res.json({
            result: 'test result'
        })
    })
}
module.exports = { userController }