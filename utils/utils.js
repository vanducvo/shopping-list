'use strict'
const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const appSettings = require('../config/app-settings')
const logger = require('../utils/logger');

let db;

function createJSON(statusCode, data){
    return {
        statusCode,
        data: JSON.stringify(data, null, '\t')
    };
}

function writeReponseItemsRequest(data, response){
    response.write(data.data);
    response.statusCode = data.statusCode;
    response.end();
}

function transformChunkIntoLines(chunk){
    let ret = { lines: [], remainder: '' };
    let lines = chunk.split(/\r?\n/);
    for (let i = 0; i < lines.length - 1; i++){
        let line = lines[i].split('|');
        ret.lines.push(line);
    }   
    ret.remainder = lines[lines.length - 1];
    return ret;
}

function parseUrl(urlString){
    let parsedUrl = url.parse(urlString, true, true);
    let pathComponents = parsedUrl.pathname.match(/(?<=\/)[^\/]+/g);
    parsedUrl.pathComponents = pathComponents || [];
    return parsedUrl;
}

function messageNotSupport(method, pathname){
    return `HTTP method ${method} not supported for path ${pathname}`;
}

function db_init(){
    logger.info(`Connecting to database: ${appSettings.db_file_name}`, 'db_init()');
    let db = new sqlite3.Database(appSettings.db_file_name, (err) => {
        if(err){
            logger.error(`Error Connecting Database, Error: ${err.message} `, 'db_init()');
        }else{
            process.on('exit', () => {
                logger.info("Closing database", "process.on(exit)");
                db.close((err) => {
                    logger.error(`Close database Error: ${err.message}`, "db.close()");
                })
            });
        }
    });

    return db;
}

function getDatabase(){
    if (!db){
        db = db_init();
    }
    return db;
}

module.exports.transformChunkIntoLines = transformChunkIntoLines;
module.exports.parseUrl = parseUrl;
module.exports.messageNotSupport = messageNotSupport;
module.exports.getDatabase = getDatabase;
module.exports.createJSON = createJSON;
module.exports.writeReponseItemsRequest = writeReponseItemsRequest;