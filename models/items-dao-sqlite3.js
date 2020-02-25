'use strict'

const logger = require('../utils/logger');
const db = require('../utils/utils').getDatabase();
const utils = require('../utils/utils');

const SELECT = `SELECT item.id as item_id,
                        item.upc as item_upc,
                        item.description as item_description,
                        item.when_created as item_when_created,
                        brand_id,
                        brand.description as brand_description,
                        brand.manufacturer as brand_manufacturer,
                        brand.location as brand_location,
                        brand.website as brand_website,
                        brand.when_created as brand_when_created`;

const FROM = 'FROM item JOIN brand ON item.brand_id = brand.id';

function findById(id){
    logger.debug('Search item by id', 'findById()');
    return new Promise((resolve, reject) => {
        let query = `${SELECT} ${FROM} WHERE item.id = ?`;
        db.get(query, id , (err, items) => {
            if(err){
                let message = `Error when run query: ${err.message}`;
                logger.error(message);
                reject(utils.createJSON(500, {query, err}));
            }else if (items){
                resolve(utils.createJSON(200, items));
            }else{
                resolve(utils.createJSON(404, {}));
            }
        });
    });
}

function findByDescription(partialDescription){
    logger.debug('Search item by partial description', 'findByDescription()');
    return new Promise((resolve, reject) => {
        let query = `${SELECT} ${FROM} WHERE item.description LIKE ?`;
        db.all(query, `%${partialDescription}%`, (err, items) => {
            if(err){
                let message = `Error when run query: ${err.message}`;
                logger.error(message);
                reject(utils.createJSON(500, {query, err}));
            }else{
                let statusCode = items.length ? 200 : 404;
                resolve(utils.createJSON(items.length, items));
            }
        });
    });
}

function findByUpc(upc){
    logger.debug('Search item by UPC', 'findByDescription()');
    return new Promise((resolve, reject) => {
        let query = `${SELECT} ${FROM} WHERE item.upc = ?`;
        console.log(query);
        db.get(query, upc, (err, items) => {
            if(err){
                let message = `Error when run query: ${err.message}`;
                logger.error(message);
                reject(utils.createJSON(500, {query, err}));
            } else if (items){
                resolve(utils.createJSON(200, items));
            } else {
                resolve(utils.createJSON(404, {}));
            }
        });
    });
}

module.exports.findById = findById;
module.exports.findByDescription = findByDescription;
module.exports.findByUpc = findByUpc;