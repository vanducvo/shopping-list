'use strict'

const assert = require('assert');

const utils = require('../utils/utils');

const logger = require('../untils/logger');

function testTransformChunkIntoLines(){
    const chunks = [
        '8921|Ocho Ri',
        'os|1|||\n8922|Coors Light|1|Coors Brewing Co.|Golden, CO 80401|coorslight.com',
        '\n8923|Garnier Herbashine|1|Garnier Inc.|New York, NY 10017|www.garnier.com\n8924|Old Dutch|1|||\n8925|Copra'
    ];

    const expects = [
        {
            lines: [],
            remainder: '8921|Ocho Ri'
        },
        {
            lines: [
                ['8921','Ocho Rios','1','','','']
            ],
            remainder: '8922|Coors Light|1|Coors Brewing Co.|Golden, CO 80401|coorslight.com'
        },
        {
            lines: [
                ['8922','Coors Light','1','Coors Brewing Co.', 'Golden, CO 80401', 'coorslight.com'],
                ['8923','Garnier Herbashine','1','Garnier Inc.','New York, NY 10017','www.garnier.com'],
                ['8924','Old Dutch','1','','','']
            ],
            remainder: '8925|Copra'
        }
    ];
    let cache = '';
    try{
        chunks.forEach((value, index) => {
            let lines = utils.transformChunkIntoLines(cache + value);
            cache = lines.remainder;
            assert.strict.deepStrictEqual(lines, expects[index], 'FAIL TESTCASE');
        });

        logger.info('PASS TESTCASE!', 'testTransformChunkIntoLines()');
    } catch(err){
        logger.error(err.message, 'testTransformChunkIntoLines()');
    }

}

function testParseUrl(){
    const testcases = [
        'http://testcase.com',
        'http://testcase.com/book/page/5',
        'http://testcase.com:8080',
        'http://testcase.com:8080/book/page/5'
    ];

    const expects = [
        {
            protocol: 'http:',
            hostname: 'testcase.com',
            port: null,
            path: '/',
            pathComponents: []
        },
        {
            protocol: 'http:',
            hostname: 'testcase.com',
            port: null,
            path: '/book/page/5',
            pathComponents: ['book', 'page', '5']
        },
        {
            protocol: 'http:',
            hostname: 'testcase.com',
            port: null,
            path: '/',
            pathComponents: []
        },
        {
            protocol: 'http:',
            hostname: 'testcase.com',
            port: 8080,
            path: '/book/page/5',
            pathComponents: ['book', 'page', '5']
        }
    ]
    try{
        testcases.forEach ((value, index) => {
            let parsedUrl = utils.parseUrl(value);
            assert.equal(parsedUrl.protocol, expects[index].protocol);
            assert.equal(parsedUrl.hostname, expects[index].hostname);
            assert.equal(parsedUrl.path, expects[index].path);
            assert.strict.deepStrictEqual(parsedUrl.pathComponents, expects[index].pathComponents);
        });
        
        logger.info('PASS TESTCASE', 'testParseUrl()');
    }catch(err){
        logger.error(err.message, 'testParseUrl()');
    }

}
(function mainline() {
    testTransformChunkIntoLines();
    testParseUrl();
})();