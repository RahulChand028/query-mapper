let mapper = async function(map, requests, parent = null) {
    let resourse = [];
    if (typeof requests == 'object' && requests instanceof Array) {
        for (request of requests) {
            if (map[request.type]) {
                if (map[request.type].before) {
                    let before = map[request.type].before(request, request.query, parent);
                    before.type ?
                        resourse.push(parseRequest(map, request, request.type, parent)) :
                        resourse.push(Promise.resolve({ errors: before.errors }));
                } else {
                    resourse.push(parseRequest(map, request, request.type, parent));
                }
            }
        }
    } else if (typeof requests == 'object' && requests != null) {
        //resourse.push(parseRequest(map, requests, requests.type, parent));
        if (map[requests.type].before) {
            let before = map[requests.type].before(requests, requests.query, parent);
            before.type ?
                resourse.push(parseRequest(map, requests, requests.type, parent)) :
                resourse.push(Promise.resolve({ errors: before.errors }));
        } else {
            resourse.push(parseRequest(map, requests, requests.type, parent));
        }
        requests = [requests];
    } else {
        return 'Invalid request';
    }
    return Promise.all(resourse).then((response) => {
        let result = {}
        requests.forEach((element, index) => {
            result[element.type] = response[index]
        });
        return result;

    }).catch((error) => {
        return error.message ? error : { error: "server error" }
    })

}

async function parseRequest(map, request, key, parent) {

    let mapRelationship = [];
    let result = [];

    let response = await map[key].resolver(request.query, parent);

    if (typeof response == 'object' && response instanceof Array) {

        response.forEach(element => {
            let holder = {
                //attributes: {}
            };
            request.attributes.forEach((attribute) => {
                holder[attribute] = typeof element[attribute] != "undefined" ? element[attribute] : '';
            });
            request.relationships ? mapRelationship.push(mapper(map, request.relationships, { key, data: element })) : '';
            result.push(holder);
        })

    } else if (typeof response == 'object' && response != null) {
        [response].forEach(element => {
            let holder = {
                //attributes: {}
            };
            request.attributes.forEach((attribute) => {
                holder[attribute] = typeof element[attribute] != "undefined" ? element[attribute] : '';
            });
            request.relationships ? mapRelationship.push(mapper(map, request.relationships, { key, data: element })) : '';
            result.push(holder);
        });

    } else {
        result = response;
    }

    if ((typeof request.relationships == "object") && (request.relationships instanceof Array || request.relationships != null)) {
        mapRelationship = await Promise.all(mapRelationship);
        result = result.map((element, index) => {
            element.relationships = mapRelationship[index];
            return element;
        })
    }

    return result;
}
module.exports = mapper;