'use strict'
const models = require('../models/items-dao');
const logger = require('../utils/logger');
const utils = require('../utils/utils');

function handleItemsSearch(request, parsedUrl, resolve, reject){
    let query = parsedUrl.query;
    if(!query){
        reject(utils.createJSON(400, "Not Have Arguments"));
    } else if (query.id){
        logger.debug('Search By Id', 'handleItemsSearch()');

        models.findById(Number.parseInt(query.id)).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    } else {
        reject( utils.createJSON(400, "Not Have Need Arguments"));
    }
}

module.exports.handleItemsSearch = handleItemsSearch;