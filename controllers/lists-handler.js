'use strict'
const models = require('../models/lists-dao');
const utils = require('../utils/utils');
const logger = require('../utils/logger');

function handleListCreate(request, parsedUrl, resolve, reject){
    let data = '';

    request.on('data', (chunk) => {
        data += chunk;
    });

    request.on('error', (err) => {
        logger.error(`Error: ${err}`, 'request parameter');
        reject(utils.createJSON(400, {err}));
    });

    request.on('end', () => {
        try {
            let json = JSON.parse(data);
            models.create(json.description).then((data)=>{
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        } catch (err){
            let message = "Data of POST not JSON";
            logger.error(message, 'handleListCreate()');
            reject(utils.createJSON(400, {err, message}));
        }
        
    })

}

module.exports.handleListCreate = handleListCreate;