let { Users, Blogs } = require("../../modal");
let { Query, Schema } = require("../../../src");

let addUser = {
    before: (request, args, parent) => {
        let userScehema = {
            firstName: Schema.isAlpha(),
            lastName: Schema.isAlpha().isOptional(),
            email: Schema.isEmail(),
            id: Schema.isUuid(),
            url: Schema.isUrl(),
            _id: Schema.isObjectId()
        };
        let validate = Query.validate(userScehema, request.query);

        return validate.errors ? { type: false, errors: validate.errors } : { type: true };
    },
    resolver: async(args, parent) => {

        try {
            let user = new Users(args);
            return await user.save();
        } catch (error) {
            throw { status: 400, message: "server error while adding user" }
        }
    }
}
let getUser = {
    resolver: async(args = {}, parent) => {

        try {
            return parent && parent.key == "getBlog" ?
                await Users.find({ _id: parent.data.author }) :
                await Users.find(args);
        } catch (error) {
            throw { status: 400, message: "server error while fetching user" }
        }
    }
}
module.exports = { addUser, getUser }