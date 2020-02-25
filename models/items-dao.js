'use strict'
const itemsDAO = require('../models/items-dao-sqlite3');

function findById(id){
    return itemsDAO.findById(id);
}

function findByDescription(partialDescription){
    return itemsDAO.findByDescription(partialDescription);
}

function findByUpc(upc){

    return itemsDAO.findByUpc(upc);
}

module.exports.findById = findById;
module.exports.findByDescription = findByDescription;
module.exports.findByUpc = findByUpc;