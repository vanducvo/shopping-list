'use strict'

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

module.exports.transformChunkIntoLines = transformChunkIntoLines;