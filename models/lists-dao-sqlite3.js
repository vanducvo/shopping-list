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

module.exports.create = create;