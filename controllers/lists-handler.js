'use strict'
const models = require('../models/lists-dao');
const utils = require('../utils/utils');
const logger = require('../utils/logger');

function handleListCreate(request, parsedUrl, resolve, reject){
    
    utils.getBodyRequest(request).then((content)=>{
        let json = JSON.parse(content);
        
        models.create(json.description).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(err);
        });
    }).catch((err)=>{
        logger.error(err.message, 'handleListCreate()');
        reject(utils.createJSON(400, {err}));
    });
  
}

function handleFindListById(request, parsedUrl, resolve, reject){
    let idstr = parsedUrl.pathComponents[1];
    let regex = /^\d+$/;
    if (regex.test(idstr)){
        let id = Number.parseInt(idstr);
        models.findShopingListById(id).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(err);
        });
    }else{
        reject(utils.createJSON(400, 'Request Id not Number'));
    }
}

function handleUpdateList(request, parsedUrl, resolve, reject){
    let idstr = parsedUrl.pathComponents[1];
    let regex = /^\d+$/;
    if (regex.test(idstr)){
        let id = Number.parseInt(idstr);
        utils.getBodyRequest(request).then((content)=>{
            let json = JSON.parse(content);
            models.update(id, json.description).then((data) => {
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }).catch((err)=>{
            logger.error(err.message, 'handleUpdateList()');
            reject(utils.createJSON(400, {err}));
        });
    }else{
        logger.error(err.message, 'handleUpdateList()');
        reject(utils.createJSON(400, 'Request Id not Number'));
    }
}

function handleFindListShoppingItems(request, parsedUrl, resolve, reject){
    let idstr = parsedUrl.pathComponents[1];
    let regex = /^\d+$/;
    if (regex.test(idstr)){
        let id = Number.parseInt(idstr);
        if(parsedUrl.pathComponents[2] == 'items'){
            models.findListShoppingItemsById(id).then((data)=>{
                resolve(data);
            }).catch((err)=>{
                reject(err);
            });
        }else{
            let message = utils.messageNotSupport(request.method, request.url);
            reject(utils.createJSON(400, message));
            logger.error(message, 'handleFindListShoppingItems()');
        }
    }else{
        logger.error(err.message, 'handleFindListShoppingItems()');
        reject(utils.createJSON(400, 'Request Id not Number'));
    }
}

function handleAddItemToList(request, parsedUrl, resolve, reject){
    let idstr = parsedUrl.pathComponents[1];
    let regex = /^\d+$/;
    if (regex.test(idstr)){
        let id = Number.parseInt(idstr);
        if(parsedUrl.pathComponents[2] == 'items'){
            utils.getBodyRequest(request).then((content)=>{
                let json = JSON.parse(content);
                models.addItemToList(id, json.itemid, json.quantity).then((data)=> {
                    resolve(data);
                }).catch((err)=>{
                    reject(err);
                });
            }).catch((err)=>{
                logger.error(err.message, 'handleFindListShoppingItems()');
                reject(utils.createJSON(400, 'Request Data Error'));
            });
        }else{
            let message = utils.messageNotSupport(request.method, request.url);
            reject(utils.createJSON(400, message));
            logger.error(message, 'handleFindListShoppingItems()');
        }
    }else{
        logger.error(err.message, 'handleFindListShoppingItems()');
        reject(utils.createJSON(400, 'Request Id not Number'));
    }
}

function handleUpdateItemInList(request, parsedUrl, resolve, reject){
    utils.getBodyRequest(request).then((content)=>{
        let json = JSON.parse(content);
        let listId = Number.parseInt(parsedUrl.pathComponents[1]);
        let itemId = Number.parseInt(parsedUrl.pathComponents[3]);
        models.updateItemsInList(listId, itemId, json.quantity, json.pick_up).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    }).catch((err)=>{
        logger.error(err.message, 'handleUpdateItemInList()');
        reject(utils.createJSON(400, 'Request Data Error'));
    });;
}

function handleDeleteItemInList(request, parsedUrl, resolve, reject){
    let listId = Number.parseInt(parsedUrl.pathComponents[1]);
    let itemId = Number.parseInt(parsedUrl.pathComponents[3]);
    models.deleteItemInList(listId, itemId).then((data) => {
        resolve(data);
    }).catch((err)=>{
        reject(err);
    });
}

module.exports.handleListCreate = handleListCreate;
module.exports.handleFindListById = handleFindListById;
module.exports.handleUpdateList = handleUpdateList;
module.exports.handleFindListShoppingItems = handleFindListShoppingItems;
module.exports.handleAddItemToList = handleAddItemToList;
module.exports.handleUpdateItemInList = handleUpdateItemInList;
module.exports.handleDeleteItemInList = handleDeleteItemInList;