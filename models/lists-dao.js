'use strict'
const listDAO = require('../models/lists-dao-sqlite3');

function create(description){
    return listDAO.create(description);
}

function findShopingListById(id){
    return listDAO.findShopingListById(id);
}

function update(id, description){
    return listDAO.update(id, description);
}
function findListShoppingItemsById(id){
    return listDAO.findListShoppingItemsById(id);
}
function addItemToList(listId, itemId, quantity){
    return listDAO.addItemToList(listId, itemId, quantity);
}

module.exports.create = create;
module.exports.findShopingListById = findShopingListById;
module.exports.update = update;
module.exports.findListShoppingItemsById = findListShoppingItemsById;
module.exports.addItemToList = addItemToList;