'use strict'
const listDAO = require('../models/lists-dao-sqlite3');

function create(description){
    return listDAO.create(description);
}

function findShopingListById(id){
    return listDAO.findShopingListById(id);
}

module.exports.create = create;
module.exports.findShopingListById = findShopingListById;