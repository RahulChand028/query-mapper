let formidable = require('formidable');
const fse = require('fs-extra')

let upload = function (req, callback) {

    let form = new formidable.IncomingForm();
    // form.encoding = 'utf-8';
    // form.uploadDir = "/my/dir";
    // form.keepExtensions = false;
    // form.type
    // form.maxFieldsSize = 20 * 1024 * 1024;

    form.parse(req, function (err, fields, files) {

        callback(err, fields, files)

    });
    form.on('progress', function (bytesReceived, bytesExpected) { });
    form.on('field', function (name, value) { });
    form.on('fileBegin', function (name, file) { });
    form.on('file', function (name, file) { });
    form.on('aborted', function () { });
    form.on('end', function () { });

    //form.on('progress/field/fileBegin/file/error/aborted/end',()=>{})
}

let move = function (options, callback) {
    gm(options.src)
        .resize(240, 240)
        .noProfile()
        .write(options.dst, callback);
}

let remove = function (src, callback) {
    fse.remove(src, callback);
}

module.exports = { upload, move, remove }