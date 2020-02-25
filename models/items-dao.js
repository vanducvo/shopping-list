'use strict'
const itemsDAO = require('../models/items-dao-sqlite3');

function findById(id){
    return itemsDAO.findById(id);
}

module.exports.findById = findById;