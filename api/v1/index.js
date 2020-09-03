let express = require('express');
let map = require('./map');
const { Query } = require("../../src");

let router = express.Router();

//let { userController } = require('./controller/user')
//router.get('/test', userController.test)


router.all("/", (request, response) => {
    console.time();

    Query.mapper(map, request.body)
        .then(result => {
            console.timeEnd();
            response.status(200).json(result);
        })
        .catch(error => {
            console.log(error)
            response.status(500).json(error);
        });
});

module.exports = router