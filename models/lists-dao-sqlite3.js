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

function findListShoppingItemsById(id){
    return new Promise((resolve, reject)=>{
        const query = `
        SELECT  shopping_list.id as shopping_list_id,
                shopping_list.description as shopping_list_description,
                shopping_list.when_created as shopping_list_when_created,
                shopping_list.when_modify,
                item.id as item_id,
                item.upc,
                item.description as item_description,
                brand.id as brand_id,
                brand.description as brand_description,
                brand.manufacturer,
                brand.location,
                brand.website,
                shopping_list_item.quantity,
                shopping_list_item.pick_up
        FROM shopping_list
            JOIN shopping_list_item ON shopping_list.id = shopping_list_item.shopping_list_id
            JOIN item ON item.id = shopping_list_item.item_id 
            JOIN brand ON brand.id = item.brand_id
        WHERE shopping_list.id = ?`;
        db.all(query, id, (err, rows) => {
            if(err){
                logger.error(`Get Error: ${err.message}`, 'findListShoppingItemsById()');
                reject(utils.createJSON(400, {query, err}));
            } else {
                resolve(utils.createJSON(200, rows));
            }
        });
    });
}

function addItemToList(listId, itemId, quantity){
    return new Promise((resolve, reject)=>{
        let query = 'INSERT INTO shopping_list_item VALUES (?,?,?)';
        db.run(query, listId, itemId, quantity, function (err){
            if(err){
                logger.error(`Get Error: ${err.message}`, 'findListShoppingItemsById()');
                reject(utils.createJSON(400, {query, err}));
            }else{
                resolve(utils.createJSON(200, {lastID: this.lastID}));
            }
        });
    });
}

module.exports.create = create;
module.exports.findShopingListById = findShopingListById;
module.exports.update = update;
module.exports.findListShoppingItemsById = findListShoppingItemsById;
module.exports.addItemToList = addItemToList;