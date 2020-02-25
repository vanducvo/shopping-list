'use strict'
const utils = require('../utils/utils');
const itemsHandler = require('../controllers/items-handler');

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
    }
}

module.exports.routeItemsRequest = routeItemsRequest;