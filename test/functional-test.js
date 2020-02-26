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

            }
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
            });
        });
        logger.info('PASS TESTCASE', 'testcaseGetById()');
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
            });
        });
        logger.info('PASS TESTCASE', 'testcaseGetByDescription()');
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
            });
        });
        logger.info('PASS TESTCASE', 'testcaseGetByUPC()');
    } catch(err){
        logger.info('FAIL TESTCASE', 'testcaseGetByUPC()');
        logger.error(`ERROR: ${err.message}`, 'testcaseGetByUPC()');
    }
}

(function mainline(){
    testcaseGetById();
    testcaseGetByDescription();
    testcaseGetByUPC();
})();