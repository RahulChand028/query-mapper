# query-mapper

`query-mapper` is an alternate solution to `graphql` that maintain `REST`. define your request in a json format.

It use joi like validator to validate request.

## Install

Install with npm:

```sh
npm i query-mapper --save
```

Install with yarn:

```sh
yarn add query-mapper
```

## Example

Here is a basic setup.

###### index.js

```js
const express = require("express");
const bodyParser = require("body-parser");
const { Query } = require("query-mapper");
const map = require("./map");

const app = express();
app.use(bodyParser.json());

app.post("/v1/api", (request, response) => {
  Query.mapper(map, request.body.request)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

app.listen(3000);
```

###### map.js

```js
let { Users, Blogs } = require("../model/models");

let map = {
  User: {
    resolver: (args, parent) => {
      return parent
        ? await Blogs.find({id:parent.data.id})
        : await Blogs.find({})
    }
  },
  Blog: {
    resolver: (args, parent) => {
      return parent
        ? await Blogs.find({id:parent.data.id})
        : await Blogs.find({})
    }
  }
};
module.exports = map;
```

## Request

- `request object to get just user Id and First Name`

```json
{
  "type": "User",
  "attributes": ["Id", "firstName"]
}
```

- `request object to get just user Id , First Name and Blogs title posted by user (shows relation with users and blogs collection)`

```json
{
  "type": "User",
  "attributes": ["Id", "firstName"],
  "relationships": {
    "type": "Blog",
    "attributes": ["title"]
  }
}
```

- `In a case of user having multiple relation like get details about blogs and product relationships would be an array`

```json
{
  "type": "User",
  "attributes": ["Id", "firstName"],
  "relationships": [
    {
      "type": "Blog",
      "attributes": ["title"]
    },
    {
      "type": "Product",
      "attributes": ["Id"]
    }
  ]
}
```

- `data could be pass with query and will be receive in args in User resolver`

```json
{
  "type": "User",
  "attributes": ["Id", "firstName"],
  "query": { "data": 1 }
}
```

# validation

```js
let { Query, Schema } = require("query-mapper");

let userScehema = {
  Id: Schema.isNumber(),
  firstName: Schema.isAlpha().isOptional(),
  blogIds: Schema.isArray([Schema.isNumber()]),
  blogDetails: Schema.isObject({
    Id: Schema.isNumber(),
    title: Schema.isString()
  })
};
```

<b style='background-color:#2ecc71;color:#fff;padding:4px'>validation success</b>

```js
let user = Query.validate(userScehema, {
  Id: 4,
  blogIds: [23, 45, 67],
  blogDetails: { Id: 4, title: "title of blog" }
});

console.log(user);
```

```json
{
  "Id": 4,
  "blogIds": [23, 45, 67],
  "blogDetails": {
    "Id": 4,
    "title": "title of blog"
  }
}
```

<b style='background-color:#e74c3c;color:#fff;padding:4px'>validation error</b>

```js
let user = Query.validate(userScehema, {
  Id: "four",
  blogIds: [23, 45, 67],
  blogDetails: { Id: 4, title: "title of blog" }
});

console.log(user);
```

```json
{
  "errors": [
    {
      "key": "Id",
      "error": "Invalid Type"
    }
  ],
  "blogIds": [23, 45, 67],
  "blogDetails": {
    "Id": 4,
    "title": "title of blog"
  }
}
```

##### Validating request before passing to resolve

```js
let { Users, Blogs } = require("../model/models");

let map = {
  User: {
    before: (request, args, parent) {
       let userScehema = {
           Id: Schema.isNumber(),
           firstName: Schema.isAlpha().isOptional(),
       };
      let validate = Query.validate(userScehema, request.query);

      return validate.errors
        ? { type: false, errors: validate.errors }
        : { type: true };
    },
    resolver: (args, parent) => {
      return parent
        ? await Blogs.find({id:parent.data.id})
        : await Blogs.find({})
    }
  },
};
module.exports = map;
```
