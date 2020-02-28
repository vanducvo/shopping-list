'use strict'
const http = require('http');
const assert = require('assert');
const logger = require('../utils/logger');
const appSettings = require('../config/app-settings');

function request(url, method, postdata){
    return new Promise((resolve, reject) => {
        let options;
        if(method == 'GET'){
            options = `http://${appSettings.server_host}:${appSettings.server_listen_port}${url}`;
            http.get(encodeURI(options), (response) => {
                let data = '';
                response.on('data', (chunk)=>{
                    data += chunk;
                });

                response.on('end', (chunk) => {
                    resolve(data);
                });

                response.on('error', (err) => {
                    reject(err);
                });
            });
        } else {
            options = {
                hostname: appSettings.server_host,
                port: appSettings.server_listen_port,
                path: encodeURI(url),
                method: method,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(postdata)
                }
            }
            let req = http.request(options, (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    resolve(data);
                });

                response.on('error', (err)=>{
                    reject(error);
                });
            });
            
            req.write(postdata);
            req.end();
        }
    });
}

var expects = [

    {
        "item_id" : 30,
        "item_upc" : "051000143709",
        "item_description" : "Campbell's Homestyle Soup Italian-style Wedding",
        "item_when_created" : "2020-02-23 11:43:31",
        "brand_id" : 29,
        "brand_description" : "Campbell's",
        "brand_manufacturer" : "Campbell Soup Company",
        "brand_location" : "Camden, NJ, U.S.A. 08103-1701",
        "brand_website" : "www.campbellsoup.com",
        "brand_when_created" : "2020-02-23 11:42:21"
    },
    {
        "item_id" : 50,
        "item_upc" : "237194000008",
        "item_description" : "Ahold Honey Ham - Water Added",
        "item_when_created" : "2020-02-23 11:43:45",
        "brand_id" : 99,
        "brand_description" : "Ahold",
        "brand_manufacturer" : "Ahold USA, Inc.",
        "brand_location" : "",
        "brand_website" : "",
        "brand_when_created" : "2020-02-23 11:43:10"
    }
]

function testcaseGetById(){
    let testcases = [
        {
            url: '/items?id=30',
            method: 'GET'
        },
        {
            url: '/items?id=50',
            method: 'GET'
        }
    ];

    try{
        testcases.forEach((value, index) => {
            request(value.url, value.method).then((data)=>{
                let request = JSON.parse(data);
                assert.strict.deepStrictEqual(request, expects[index]);
                return true;
            }).then((pass)=>{
                if (pass){
                    logger.info("PASS TESTCASE", 'testCreateList()');
                } else {
                    logger.info("FAIL TESTCASE", 'testCreateList()');
                }
            });
        });
    } catch(err){
        logger.info('FAIL TESTCASE', 'testcaseGetById()');
        logger.error(`ERROR: ${err.message}`, 'testcaseGetById()');
    }
}

function testcaseGetByDescription(){
    let testcases = [
        {
            url: "/items?description=Campbell's Homestyle Soup Italian-style Wedding",
            method: 'GET'
        },
        {
            url: '/items?description=Ahold Honey Ham - Water Adde',
            method: 'GET'
        }
    ];

    try{
        testcases.forEach((value, index) => {
            request(value.url, value.method).then((data)=>{
                let request = JSON.parse(data);
                assert.strict.deepStrictEqual(request[0], expects[index]);
                return true;
            }).then((pass) => {
                if (pass){
                    logger.info("PASS TESTCASE", 'testcaseGetByDescription()');
                } else {
                    logger.info("FAIL TESTCASE", 'testcaseGetByDescription()');
                }
            });
        });
        
    } catch(err){
        logger.info('FAIL TESTCASE', 'testcaseGetByDescription()');
        logger.error(`ERROR: ${err.message}`, 'testcaseGetByDescription()');
    }
}

function testcaseGetByUPC(){
    let testcases = [
        {
            url: '/items?upc=051000143709',
            method: 'GET'
        },
        {
            url: '/items?upc=237194000008',
            method: 'GET'
        }
    ];

    try{
        testcases.forEach((value, index) => {
            request(value.url, value.method).then((data)=>{
                let request = JSON.parse(data);
                assert.strict.deepStrictEqual(request, expects[index]);
                return true;
            }).then((pass) => {
                if (pass){
                    logger.info("PASS TESTCASE", 'testcaseGetByUPC()');
                } else {
                    logger.info("FAIL TESTCASE", 'testcaseGetByUPC()');
                }
            });
        });
    } catch(err){
        logger.info('FAIL TESTCASE', 'testcaseGetByUPC()');
        logger.error(`ERROR: ${err.message}`, 'testcaseGetByUPC()');
    }
}

function testCreateList(){
    let testcases = [
        {
            url: '/lists',
            method: 'POST',
            postData: '{"description": "test-list1"}'
        },
        {
            url: '/lists',
            method: 'POST',
            postData: '{"description": "test-list2"}'
        }
    ];

    try{
        testcases.forEach((value, index) => {
            request(value.url, value.method, value.postData).then((data) => {
                try{
                    let json = JSON.parse(data);
                    return json.hasOwnProperty('lastID')
                } catch(err){
                    
                    logger.error(`ERROR: ${err.message}`, 'testCreateList()');s
                }
            }).then((pass) => {
                if (pass){
                    logger.info("PASS TESTCASE", 'testCreateList()');
                } else {
                    logger.info("FAIL TESTCASE", 'testCreateList()');
                }
            });
        });


    }catch(error){
        logger.info("FAIL TESTCASE", 'testCreateList()');
        logger.error(`ERROR: ${err.message}`, 'testCreateList()');
    }
}

function testUpdateList(){
    let testcases = [
        {
            url: '/lists/1',
            method: 'PUT',
            postData: '{"description": "test-list-1-modify"}'
        },
        {
            url: '/lists/2',
            method: 'PUT',
            postData: '{"description": "test-list-2-modify"}'
        }
    ];

    try{
        testcases.forEach((value, index) => {
            request(value.url, value.method, value.postData).then((data) => {
                try{
                    let json = JSON.parse(data);
                    return json.hasOwnProperty('changes')
                } catch(err){
                    
                    logger.error(`ERROR: ${err.message}`, 'testUpdateList()');s
                }
            }).then((pass) => {
                if (pass){
                    logger.info("PASS TESTCASE", 'testUpdateList()');
                } else {
                    logger.info("FAIL TESTCASE", 'testUpdateList()');
                }
            });
        });

    }catch(error){
        logger.info("FAIL TESTCASE", 'testUpdateList()');
        logger.error(`ERROR: ${err.message}`, 'testUpdateList()');
    }
}

function testGetItemsInShoppingList(){
    let testcases = [
        {
            url: '/lists/1/items',
            method: 'GET'
        }
    ];

    let expects = [
        [
            {
                "shopping_list_id": 1,
                "shopping_list_description": "test-list-1-modify",
                "shopping_list_when_created": "2020-02-27 08:47:27",
                "when_modify": "2020-02-27 08:48:57",
                "item_id": 1,
                "upc": "023923330139",
                "item_description": "Earth's Best Organic Fruit Yogurt Smoothie Mixed Berry",
                "brand_id": 78,
                "brand_description": "Earth's Best",
                "manufacturer": "The Hain Celestial Group, Inc.",
                "location": "",
                "website": "",
                "quantity": 2,
                "pick_up": 1
            },
            {
                "shopping_list_id": 1,
                "shopping_list_description": "test-list-1-modify",
                "shopping_list_when_created": "2020-02-27 08:47:27",
                "when_modify": "2020-02-27 08:48:57",
                "item_id": 2,
                "upc": "688267141676",
                "item_description": "Ahold Cocoa Almonds",
                "brand_id": 99,
                "brand_description": "Ahold",
                "manufacturer": "Ahold USA, Inc.",
                "location": "",
                "website": "",
                "quantity": 20,
                "pick_up": 0
            }
        ]
    ];
    try{
        testcases.forEach((value, index) => {
            request(value.url, value.method).then((data)=>{
                let json = JSON.parse(data);
                return json.length >= 0;
            }).then((pass)=>{
                if (pass){
                    logger.info("PASS TESTCASE", 'testGetItemsInShoppingList()');
                } else {
                    logger.info("FAIL TESTCASE", 'testGetItemsInShoppingList()');
                };
            });
        });
        
    } catch(err){
        logger.info('FAIL TESTCASE', 'testGetItemsInShoppingList()');
        logger.error(`ERROR: ${err.message}`, 'testGetItemsInShoppingList()');
    }
}

function testAddItemToList(){
    let testcases = [
        {
            url: '/lists/1/items',
            method: 'POST',
            postData: '{"itemid": 50, "quantity": 2}'
        },
        {
            url: '/lists/1/items',
            method: 'POST',
            postData: '{"itemid": 40, "quantity": 2}'
        }
    ];

    try{
        let pass = true;
        testcases.forEach((value, index) => {
            request(value.url, value.method, value.postData).then((data)=>{
                let json = JSON.parse(data);
                return json.hasOwnProperty('lastID');
            }).then((pass) =>{
                if (pass){
                    logger.info("PASS TESTCASE", 'testAddItemToList()');
                } else {
                    logger.info("FAIL TESTCASE", 'testAddItemToList()');
                };
            });
        });
    }catch(err){
        logger.info("FAIL TESTCASE", 'testAddItemToList()');
        logger.error(`ERROR: ${err.message}`, 'testAddItemToList()');
    }
}

function testUpdateItemsInList(){
    let testcases = [
        {
            url: '/lists/1/items/1',
            method: 'PUT',
            postData: '{"pick_up": 0}'
        },
        {
            url: '/lists/1/items/2',
            method: 'PUT',
            postData: '{"quantity": 22}'
        },
        {
            url: '/lists/1/items/3',
            method: 'PUT',
            postData: '{"pick_up": 0, "quantity": 33}'
        }
    ];

    try{
        testcases.forEach((value, index) => {
            request(value.url, value.method, value.postData).then((data) => {
                try{
                    let json = JSON.parse(data);
                    return json.hasOwnProperty('changes')
                } catch(err){
                    
                    logger.error(`ERROR: ${err.message}`, 'testUpdateItemsInList()');
                }
            }).then((pass) => {
                if (pass){
                    logger.info("PASS TESTCASE", 'testUpdateItemsInList()');
                } else {
                    logger.info("FAIL TESTCASE", 'testUpdateItemsInList()');
                }
            });
        });

    }catch(error){
        logger.info("FAIL TESTCASE", 'testUpdateItemsInList()');
        logger.error(`ERROR: ${err.message}`, 'testUpdateItemsInList()');
    }
}

function testDeleteItemInList(){
    let testcases = [
        {
            url: '/lists/1/items',
            itemid: 88,
            method: 'DELETE'
        }
    ];

    testcases.forEach((value, index) => {
        request('/lists/1/items', 'POST', `{"itemid": ${value.itemid}, "quantity": 2, "pick_up": 0}`).then(()=>{
            request(`${value.url}/${value.itemid}`, value.method, '').then((data)=>{
                try{
                    let json = JSON.parse(data);
                    return json.hasOwnProperty('changes')
                } catch(err){
                    
                    logger.error(`ERROR: ${err.message}`, 'testDeleteItemInList()');
                }
            }).then((pass) => {
                if (pass){
                    logger.info("PASS TESTCASE", 'testDeleteItemInList()');
                } else {
                    logger.info("FAIL TESTCASE", 'testDeleteItemInList()');
                }
            });
        });
    });
}


(function mainline(){
    testcaseGetById();
    testcaseGetByDescription();
    testcaseGetByUPC();
    testCreateList();
    testUpdateList();
    testGetItemsInShoppingList();
    testAddItemToList();
    testUpdateItemsInList();
    testDeleteItemInList();
})();