'use strict'

const assert = require('assert');

const utils = require('../untils/untils');

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

(function mainline() {
    testTransformChunkIntoLines();
})();