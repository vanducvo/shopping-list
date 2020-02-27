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


module.exports.handleListCreate = handleListCreate;
module.exports.handleFindListById = handleFindListById;
module.exports.handleUpdateList = handleUpdateList;