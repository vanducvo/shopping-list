'use strict'
const fs = require('fs');
const logger = require('../untils/logger');
const sqlite3 = require('sqlite3').verbose();
const appSettings = require('../config/app-settings');
const utils = require('../untils/untils');

function loadFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

function createDatabaseFixtures(db) {
    return new Promise((resolve, reject) => {
        return new Promise((resolve, reject) => {
            logger.info('Dropping all tables database...', 'createDatabaseFixtures()');
            for (let table_name in appSettings.table_sql) {
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

function loadDataToDatabase(db, filename, handleRows) {
    return new Promise((resolve, reject) => {
        logger.info('Loading database ...', 'loadDataToDatabase()');
        let reader = fs.createReadStream(filename);
        let cache = '';
        reader.on('open', () => {
            logger.info(`Reading ${filename}`, 'loadDataToDatabase:ReadStream(open)');
        }).on('data', (chunk) => {
            logger.debug(`Chunk size: ${chunk.length}`, 'loadDataToDatabase:ReadStream(data)');
            let actualChunk = cache + chunk;
            logger.debug(`Actual Chunk  size: ${actualChunk.length}`, 'loadDataToDatabase:ReadStream(data)');
            let { lines, remainder } = utils.transformChunkIntoLines(actualChunk);

            cache = remainder;
            for (let line of lines) {
                handleRows(db, line);
            }
        }).on('error', (err) => {
            logger.error(`Error: ${err.message}`, 'loadDataToDatabase:ReadStream(error)');
        }).on('close', () => {
            logger.info(`close file: ${filename}`, 'loadDataToDatabase:ReadStream(close)');
            resolve();
        });
    });
}

function handleRowsBrands(db, line) {
    let description = line[1];
    let manufacturer = line[3] ? line[3] : '';
    let location = line[4] ? line[4] : '';
    let website = line[5] ? line[5] : '';

    db.run('INSERT INTO brand (description, manufacturer, location, website) VALUES(?,?,?,?)',
        description, manufacturer, location, website, (err) => {
            if (err) {
                logger.error('INSERT INTO brand ERROR' + err.message +
                    ' with desciption:' + description + ', manufacturer: ' + manufacturer +
                    ', location' + location + ', website: ' + website,
                    'handleRowsBrands:db.run'
                );
            }
        }
    );

}

function handleRowsItems(db, line) {
    let upc = line[2];
    let brandDescription = line[3];
    let itemDesciption = line[4];
    db.run('INSERT INTO item (brand_id, upc, description) VALUES ((SELECT id FROM brand WHERE description = ?), ?, ? )',
        brandDescription, upc, itemDesciption, (err) => {
            if (err) {
                logger.error('INSERT INTO item ERROR' + err.message +
                    ' with upc: ' + upc + ', itemDesciption: ' + itemDesciption +
                    ', brandDescription: ' + brandDescription,
                    'handleRowsItems:db.run'
                );
            }
        }
    );
}

(function mainline() {
    logger.info(`Script load-bd run at ${new Date().toLocaleDateString()}`, 'mainline()');
    logger.info(`Creating Database: ${appSettings.db_file_name}`, 'mainline()');
    let db = new sqlite3.Database(appSettings.db_file_name);
    let promiseTables = createDatabaseFixtures(db);
    promiseTables.then(() => {
        loadDataToDatabase(db, appSettings.brand_file_name, handleRowsBrands).then(() => {
            logger.info('Load data into brand tables DONE', 'mainline:loadDataToDatabase(resolve)');
            loadDataToDatabase(db, appSettings.item_file_name, handleRowsItems).then(() => {
                logger.info('Load data into item tables DONE', 'mainline:loadDataToDatabase(resolve)');
            });
        });
    }).catch((err) => {
        logger.error("Create and Load FAIL, please try again", 'mainline:promiseTables(catch)');
    });

    process.on('exit', (code) => {
        db.close((err) => {
            logger.error(`Close Database Error: ${err.message}`);
        });
    });

})();