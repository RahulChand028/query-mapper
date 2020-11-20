let mapper = require("./mapper");
let Query = {};
let validator = {};

validator.pre = function (schema, payload, key) {
    if (schema.before) {
        payload = schema.before(payload);
    }

    return schema.optional && !payload ? { completed: 1, value: undefined } : { completed: 0, value: { schema, payload, key } };
};

validator.post = function (schema, payload, key) {

    if (schema.type.value == "number") {
        if (schema.min && payload < schema.min.value) {
            return {
                value: {
                    key,
                    error: schema.min.message ? schema.min.message : "min property failed"
                }
            };
        }
        if (schema.max && payload > schema.max.value) {
            return {
                value: {
                    key,
                    error: schema.min.message ? schema.min.message : "max property failed"
                }
            };
        }
    }
    if (["alpha", "alphanumeric", "string"].includes(schema.type.value)) {
        if (schema.min && payload.length < schema.min.value) {
            return {
                value: {
                    key,
                    error: schema.min.message ? schema.min.message : "min property failed"
                }
            };
        }
        if (schema.max && payload.length > schema.max.value) {
            return {
                value: {
                    key,
                    error: schema.min.message ? schema.min.message : "max property failed"
                }
            };
        }
    }
    if (schema.name) {
        console.log(schema.name)
        key = schema.name;
    }
    return { key, value: payload };
};

validator.typeSelector = function (schema, payload, key) {
    let preResult = validator.pre(schema, payload, key);
    if (preResult.completed) {
        return preResult.value;
    }

    schema = preResult.value.schema;
    payload = preResult.value.payload;
    key = preResult.value.key;
    let result = {};
    if (!schema.type) {
        return { key, value: "Invaid Property define" };
    }
    switch (schema.type.value) {
        case "number":
            result = validator.number(schema, payload, key);
            break;
        case "alpha":
            result = validator.alpha(schema, payload, key);
            break;
        case "array":
            result = validator.array(schema, payload, key);
            break;
        case "object":
            result = validator.object(schema, payload, key);
            break;
        case "alphaNumeric":
            result = validator.alphanumeric(schema, payload, key);
            break;
        case "pattern":
            result = validator.pattern(schema, payload, key);
            break;
        case "email":
            result = validator.email(schema, payload, key);
            break;
        case "string":
            result = validator.string(schema, payload, key);
            break;
        case "uuid":
            result = validator.uuid(schema, payload, key);
            break;
        case "url":
            result = validator.url(schema, payload, key);
            break;
        case "objectId":
            result = validator.objectId(schema, payload, key);
            break;
        case "in":
            result = validator.In(schema, payload, key);
            break;
        case "boolean":
            result = validator.Boolean(schema, payload, key);
            break;
        default:
            return { key, error: "Invalid property type" };
    }
    return result.completed ? { key, value: result.value } :
        validator.post(schema, result.value, key);
};

validator.pattern = function (schema, payload, key) {
    const regex = RegExp(schema.type.desc);
    let regexExec = regex.exec(payload);
    return typeof payload == "string" &&
        regexExec &&
        regexExec[0].length == payload.length ? { completed: 0, value: payload } : {
            completed: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
};

validator.In = function (schema, payload, key) {
    return schema.type.list.some(item => item == payload) ? { completed: 0, value: payload } : {
        completed: 1,
        value: {
            key,
            error: schema.type.message ? schema.type.message : "Invalid Type"
        }
    };
};

validator.Boolean = function (schema, payload, key) {
    console.log(schema, payload, key)
    return payload == "true" || payload == "false" ? { completed: 0, value: payload == "true" ? true : false } : {
        completed: 1,
        value: {
            key,
            error: schema.type.message ? schema.type.message : "Invalid Type"
        }
    };
};

validator.number = function (schema, payload, key) {
    return isNaN(payload) ? {
        completed: 1,
        value: {
            key,
            error: schema.type.message ? schema.type.message : "Invalid Type"
        }
    } : { completed: 0, value: +payload };
};

validator.object = function (schema, payload, key) {
    if (
        typeof payload == "object" &&
        payload != null &&
        !(payload instanceof Array)
    ) {
        if (Object.keys(schema.type.desc).length) {
            let valid = Query.validate(schema.type.desc, payload);
            return valid.errors ? { completed: 1, value: valid } : { completed: 0, value: valid };
        } else {
            return { completed: 0, value: payload };
        }
    } else {
        return {
            completed: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
    }
};
validator.array = function (schema, payload, key) {
    if (typeof payload == "object" && payload instanceof Array) {
        if (Object.keys(schema.type.desc).length) {
            let valid = true;
            let error;
            if (
                typeof schema.type.desc == "object" &&
                schema.type.desc instanceof Array
            ) {
                valid = payload.every(load => {
                    return schema.type.desc.some(desc => {
                        error = validator.typeSelector(desc, load, key).value.error;
                        return !error;
                    });
                });
            } else if (typeof schema.type.desc == "object") {
                valid = payload.every(load => {
                    error = validator.typeSelector(schema.type.desc, load, key).value
                        .error;
                    return !error;
                });
            }
            return valid ? { completed: 0, value: payload } : {
                completed: 1,
                value: {
                    key,
                    error: schema.type.message ? schema.type.message : error
                }
            };
        } else {
            return { completed: 0, value: payload };
        }
    } else {
        return {
            completed: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
    }
};

validator.alpha = function (schema, payload, key) {
    const regex = /[a-zA-Z]+/g;
    let regexExec = regex.exec(payload);
    return typeof payload == "string" &&
        regexExec &&
        regexExec[0].length == payload.length ? { completed: 0, value: payload } : {
            completed: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
};
validator.string = function (schema, payload, key) {
    return typeof payload == "string" ? { completed: 0, value: payload } : {
        completed: 1,
        value: {
            key,
            error: schema.type.message ? schema.type.message : "Invalid Type"
        }
    };
};
validator.email = function (schema, payload, key) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
    let regexExec = regex.exec(payload);
    return typeof payload == "string" &&
        regexExec &&
        regexExec[0].length == payload.length ? { completed: 0, value: payload } : {
            completed: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
};

validator.uuid = function (schema, payload, key) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    let regexExec = regex.exec(payload);
    return typeof payload == "string" &&
        regexExec &&
        regexExec[0].length == payload.length ? { completed: 0, value: payload } : {
            completed: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
};
validator.url = function (schema, payload, key) {
    const regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i

    let regexExec = regex.exec(payload);
    return typeof payload == "string" &&
        regexExec &&
        regexExec[0].length == payload.length ? { completed: 0, value: payload } : {
            completed: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
};
validator.objectId = function (schema, payload, key) {
    const regex = /([0-9a-f]){24}/i

    let regexExec = regex.exec(payload);
    return typeof payload == "string" &&
        regexExec &&
        regexExec[0].length == payload.length ? { completed: 0, value: payload } : {
            completed: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
};
validator.alphanumeric = function (schema, payload, key) {
    const regex = /[a-zA-Z0-9]+/g;
    return typeof payload == "string" &&
        regex.exec(payload)[0].length == payload.length ? { completed: 0, value: payload } : {
            completeds: 1,
            value: {
                key,
                error: schema.type.message ? schema.type.message : "Invalid Type"
            }
        };
};

Query.validate = function (schema, payload) {
    if (typeof schema != "object") {
        return {
            errors: "Root schema expected to be an Object"
        };
    } else if (typeof payload != "object") {
        return {
            errors: "payload expected to be an Object"
        };
    } else if (payload != null) {
        let schemaKeys = Object.keys(schema);
        let returnPayload = {};
        let validateResponse = {};
        for (let key of schemaKeys) {
            validateResponse = validator.typeSelector(schema[key], payload[key], key);
            if (validateResponse == undefined) { } else if (validateResponse.value.error) {
                returnPayload.errors ?
                    (returnPayload.errors[returnPayload.errors.length] =
                        validateResponse.value) :
                    (returnPayload.errors = [validateResponse.value]);
            } else {
                returnPayload[validateResponse.key] = validateResponse.value;
            }
        }
        return returnPayload;
    } else {
        return {
            error: "provide valid object"
        };
    }
};

Query.mapper = mapper;
module.exports = Query;