'use strict'

const level = {
    TRACE: {priority: 0, outputString: 'TRACE'},
    DEBUG: {priority: 100, outputString: 'DEBUG'},
    INFO: {priority: 200, outputString: 'INFO'},
    WARN: {priority: 300, outputString: 'WARN'},
    ERROR: {priority: 400, outputString: 'ERROR'},
    FATAL: {priority: 500, outputString: 'FATAL'},
    OFF: {priority: 1000, outputString: 'OFF'}
};

var logLevel = level.INFO;
function setLogLevel(value){
    logLevel = value;
}

var decorateOutputMessage = true;
function setDecorateOutputMessage (value) {
    decorateOutputMessage = value;
}

function log (messageLogLevel, message, source) {
    if (messageLogLevel.priority >= logLevel.priority) {
        let decorateMessage = message.toString();
        if (decorateOutputMessage){
            let time = Date.now();
            let header = time.toString() + ':' + messageLogLevel.outputString;
            decorateMessage = header + (source ? (':' + source + ':') : ':') + decorateMessage;
        }
        console.log(decorateMessage);
    }
}

function trace (message, source) {
    log(level.TRACE, message, source);
}

function debug (message, source) {
    log(level.DEBUG, message, source);
}

function info (message, source) {
    log(level.INFO, message, source);
}

function warn (message, source) {
    log(level.WARN, message, source);
}

function error (message, source) {
    log(level.ERROR, message, source);
}

function fatal (message, source) {
    log(level.FATAL, message, source);
}

function off (message, source){
    log(level.OFF, message, message);
}

module.exports.level = level;
module.exports.setLogLevel = setLogLevel;
module.exports.setDecorateOutputMessage = setDecorateOutputMessage;

module.exports.log = log;
module.exports.trace = trace;
module.exports.debug = debug;
module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;
module.exports.fatal = fatal;
module.exports.off = off;