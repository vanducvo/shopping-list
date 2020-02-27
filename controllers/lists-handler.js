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

module.exports.handleListCreate = handleListCreate;