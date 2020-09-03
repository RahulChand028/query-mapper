let { Users, Blogs } = require("../../modal");
let { Query, Schema } = require("../../../src");

let addBlog = {
    before: (request, args, parent) => {
        let blogScehema = {
            title: Schema.isString(),
            author: Schema.isString(),
            body: Schema.isString()
        };
        let validate = Query.validate(blogScehema, request.query);

        return validate.errors ? { type: false, errors: validate.errors } : { type: true };
    },
    resolver: async(args, parent) => {

        try {
            let blog = new Blogs(args);
            return await blog.save();
        } catch (error) {
            console.log(error)
            throw { status: 400, message: "server error while adding blog" }
        }
    }
}
let getBlog = {
    resolver: async(args = {}, parent) => {

        try {

            return parent && parent.key == "getUser" ?
                await Blogs.find({ author: parent.data._id, ...args }) :
                await Blogs.find(args);
        } catch (error) {
            throw { status: 400, message: "server error while fetching blog" }
        }
    }
}
module.exports = { addBlog, getBlog }