'use strict'
const listDAO = require('../models/lists-dao-sqlite3');

function create(description){
    return listDAO.create(description);
}

module.exports.create = create;
