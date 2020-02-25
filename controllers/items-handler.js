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
    }else if (query.description) {
        logger.debug('Search By Descripton', 'handleItemsSearch()');

        models.findByDescription(query.description).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    }else if (query.upc){
        logger.debug('Search By Upc', 'handleItemsSearch()');

        models.findByUpc(query.upc).then((data) => {
            resolve(data);
        }).catch((err) => {

            reject(err);
        });
    } else {
        reject( utils.createJSON(400, "Not Have Need Arguments"));
    }
}

module.exports.handleItemsSearch = handleItemsSearch;