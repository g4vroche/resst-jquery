var jQuery = require('jquery')

module.exports = {

    "handle": function(request, assigner){
        var params = Object.assign({}, request, {
            type: request.method,
            cache: true,
            url: request.uri,
            data: request.body
        });
        
        return new Promise(function(resolve, reject){

            params.success = function(body, status, response){
                resolve(assigner(formatResponse(response)));
            };

            params.error = function(response){
                if (response.status >= 200 && response.status < 400){
                    resolve(assigner(formatResponse(response)));
                } else {
                    reject(assigner(formatResponse(response)));    
                }
            };

            jQuery.ajax(params);
        });
    }
};


function formatResponse(response){

    return {
        "headers": parseHeaders(response.getAllResponseHeaders()),
        "status": {
            "code": response.status,
            "message": response.statusText
        },
        "body": response.responseText,
    };
}

function parseHeaders(headerSting){
    var headers = {};
    headerSting.split("\r\n").map( function(line) {
        if(line.trim() !== ""){
            line = line.split(":");
            headers[line.shift().trim()] = line.join(":").trim();
        }
    });

    return headers;
}


