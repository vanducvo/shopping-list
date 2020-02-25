'use strict'
const url = require('url');
const http = require('http');
const routes = require('./controllers/routes');
const appSettings = require('./config/app-settings')
const utils = require('./utils/utils');

const server = http.createServer((request, response) => {
    if (request.url.startsWith('/items')){
        response.statusCode = 200;
        routes.routeItemsRequest(request).then((data) => {
            utils.writeReponseItemsRequest(data, response);
        }).catch((err) => {
            utils.writeReponseItemsRequest(err, response);
        });
    } else {
        response.statusCode = 404;
        response.write('Path Not Found');
        response.end();
    }
});

server.listen(appSettings.server_listen_port, appSettings.server_host);
