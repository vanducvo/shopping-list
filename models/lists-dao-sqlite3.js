'use strict'

const logger = require('../utils/logger');
const utils = require('../utils/utils');

const db = utils.getDatabase();

function create(description){
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO shopping_list (description) VALUES (?)`;
        db.run(query, description, function (err){
            if(err){
                logger.error(`Insert Error: ${err.message}`, 'create()');
                reject(utils.createJSON(400, {query, err}));
            }else{
                resolve(utils.createJSON(201, {lastID: this.lastID}));
            }

        });
    });
}

function findShopingListById(id){
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM shopping_list WHERE id = ?';
        db.get(query, id, (err, list) => {
            if(err){
                logger.error(`Insert Error: ${err.message}`, 'findShopingListById()');
                reject(utils.createJSON(400, {query, err}));
            }else if (list){
                resolve(utils.createJSON(200, list));
            } else {
                resolve(utils.createJSON(200, {}));
            }
        });
    });
}

function update(id, description){
    return new Promise((resolve, reject)=>{
        let query = "UPDATE shopping_list SET description = ?, when_modify = datetime('now') WHERE id = ?";
        db.run(query, description, id, function (err){
            if(err){
                logger.error(`Update Error: ${err.message}`, 'update()');
                reject(utils.createJSON(400, {query, err}));
            }else{
                resolve(utils.createJSON(200, {changes: this.changes}));
            }
        });
    });
}

module.exports.create = create;
module.exports.findShopingListById = findShopingListById;
module.exports.update = update;