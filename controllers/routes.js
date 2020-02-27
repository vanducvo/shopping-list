'use strict'
const utils = require('../utils/utils');
const itemsHandler = require('../controllers/items-handler');
const listsHandler = require('../controllers/lists-handler');
function routeItemsRequest(request){
    return new Promise((resolve, reject) => {
        let parsedUrl = utils.parseUrl(request.url);

        if (parsedUrl.pathComponents.length != 1){
            reject(utils.createJSON(400, 'Reqest Items Reject'));
        } else {
            switch(parsedUrl.pathComponents[0]){
                case 'items':
                    routeItemsOnly(request, parsedUrl, resolve, reject);
                    break;
                default:
                    reject(utils.createJSON(400, 'Reqest Items Reject'));
                    break;
            }
        }  
    });
}

function routeItemsOnly(request, parsedUrl, resolve, reject){
    switch(request.method){
        case 'GET':
            itemsHandler.handleItemsSearch(request, parsedUrl, resolve, reject);
            break;
        default:
            let message = utils.messageNotSupport(request.method, request.url);
            reject(utils.createJSON(400, message));
            break;
    }
}

function routeListsRequest(request){
    return new Promise((resolve, reject) => {
        let parsedUrl = utils.parseUrl(request.url);

        if (parsedUrl.pathComponents[0] != 'lists'){
            reject(utils.createJSON(400, 'Request List Reject'));
        };

        switch(parsedUrl.pathComponents.length){
            case 1:

                routeListsOnly(request, parsedUrl, resolve, reject);
                break;
            case 2:
                routeListsOnlyWithId(request, parsedUrl, resolve, reject);
                break;
            default:
                reject(utils.createJSON(400, 'Request List Reject'));
                break;
        }
    });
}

function routeListsOnly(request, parsedUrl, resolve, reject){
    switch(request.method){
        case 'POST':
            listsHandler.handleListCreate(request, parsedUrl, resolve, reject);
            break;
        default:
            let message = utils.messageNotSupport(request.method, request.url);
            reject(utils.createJSON(400, message));
            break;
    }
}

function routeListsOnlyWithId(request, parsedUrl, resolve, reject){
    switch(request.method){
        case 'GET':
            listsHandler.handleFindListById(request, parsedUrl, resolve, reject);
            break;
        case 'PUT':
            break;
        default:
            let message = utils.messageNotSupport(request.method, resquest.url);
            reject(utils.createJSON(400, message));
            break;
    }
}

module.exports.routeItemsRequest = routeItemsRequest;
module.exports.routeListsRequest = routeListsRequest;