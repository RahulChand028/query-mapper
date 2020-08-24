function Schema() {}
Schema.prototype.isAlpha = function(error_message) {
  return Object.assign(new Schema(), this, {
    type: { value: "alpha", message: error_message }
  });
};
Schema.prototype.isNumber = function(error_message) {
  return Object.assign(new Schema(), this, {
    type: { value: "number", message: error_message }
  });
};
Schema.prototype.isAlphaNumeric = function(error_message) {
  return Object.assign(new Schema(), this, {
    type: { value: "alphaNumeric", message: error_message }
  });
};
Schema.prototype.isString = function(error_message) {
  return Object.assign(new Schema(), this, {
    type: { value: "string", message: error_message }
  });
};
Schema.prototype.isEmail = function(error_message) {
  return Object.assign(new Schema(), this, {
    type: { value: "email", message: error_message }
  });
};
Schema.prototype.isUrl = function(error_message) {
  return Object.assign(new Schema(), this, {
    type: { value: "url", message: error_message }
  });
};
Schema.prototype.isArray = function(schema, error_message) {
  return Object.assign(new Schema(), this, {
    type: { value: "array", desc: schema ? schema : {}, message: error_message }
  });
};

Schema.prototype.isObject = function(schema, error_message) {
  return Object.assign(new Schema(), this, {
    type: {
      value: "object",
      desc: schema ? schema : {},
      message: error_message
    }
  });
};
Schema.prototype.isPattern = function(pattern, error_message) {
  return Object.assign(new Schema(), this, {
    type: {
      value: "pattern",
      desc: pattern ? pattern : "",
      message: error_message
    }
  });
};
Schema.prototype.isOptional = function() {
  return Object.assign(new Schema(), this, { optional: 1 });
};
Schema.prototype.rename = function(name) {
  return Object.assign(new Schema(), this, { name });
};
Schema.prototype.min = function(num, error_message) {
  return Object.assign(new Schema(), this, {
    min: { value: num, message: error_message }
  });
};
Schema.prototype.max = function(num, error_message) {
  return Object.assign(new Schema(), this, {
    max: { value: num, message: error_message }
  });
};
Schema.prototype.beforeValidation = function(callback) {
  return Object.assign(new Schema(), this, { before: callback });
};
Schema.prototype.afterValidation = function(callback) {
  return Object.assign(new Schema(), this, { after: callback });
};
Schema.prototype.isIn = function(list = [], error_message) {
  return Object.assign(new Schema(), this, { type: "in", list });
};

module.exports = new Schema();
