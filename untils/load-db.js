'use strict'
const fs = require('fs');
const logger = require('../untils/logger');
const sqlite3 = require('sqlite3').verbose();
const appSettings = require('../config/app-settings');

function loadFile (filename){
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err){
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

function createDatabaseFixtures(db){
    return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
            logger.info('Dropping all tables database...', 'createDatabaseFixtures()');
            for (let table_name in appSettings.table_sql){
                db.run(`DROP TABLE IF EXISTS ${table_name}`)
            }
            logger.info('Droped all tables done!', 'createDatabaseFixtures()');
            resolve()
        }).then(() => {
            return loadFile(appSettings.table_sql.brand);
        }).then((scriptsCreateBrandTable) => {
            logger.info('Creating Brand Table', 'createDatabaseFixtures()');
            db.run(scriptsCreateBrandTable);
            logger.info('Created Brand Table', 'createDatabaseFixtures()');
            return loadFile(appSettings.table_sql.item);
        }).then((scriptsCreateItemTable) => {
            logger.info('Creating Item Table', 'createDatabaseFixtures()');
            db.run(scriptsCreateItemTable);
            logger.info('Created Item Table', 'createDatabaseFixtures()');
            return loadFile(appSettings.table_sql.shopping_list);
        }).then((scriptsCreateShoppingListTable) => {
            logger.info('Creating Shopping List', 'createDatabaseFixtures()');
            db.run(scriptsCreateShoppingListTable);
            logger.info('Created Shopping Item', 'createDatabaseFixtures()');
            return loadFile(appSettings.table_sql.shopping_list_item);
        }).then((scriptsCreateShoppingListItemTable) => {
            logger.info('Creating Shopping List Item', 'createDatabaseFixtures()');
            db.run(scriptsCreateShoppingListItemTable);
            logger.info('Created Shopping List Item', 'createDatabaseFixtures()');
            return Promise.resolve();
        }).catch((err) => {
            logger.error(`Error: Create database is fail. With Error ${err.message}`);
        }).then(() => {
            logger.info("Create tables is DONE!");
            resolve();
        });
    });
}

function loadDataToDatabase(db){
    
}

(function mainline (){
    logger.info(`Script load-bd run at ${new Date().toLocaleDateString()}`, 'mainline()');
    logger.info(`Creating Database: ${appSettings.db_file_name}`, 'mainline()');
    let db = new sqlite3.Database(appSettings.db_file_name);
    let promiseTables = createDatabaseFixtures(db);
    promiseTables.then(() => {
        console.log('Code Here!');
    }).catch((err) => {
        console.log('Code Here');
    });

    process.on('exit', (code) => {
        db.close((err) => {
            logger.error(`Close Database Error: ${err.message}`);
        });
    });

})();