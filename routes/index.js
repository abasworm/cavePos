var route = require('express').Router();

route.use('/login', require('../modules/login'));

route.use('/dashboard', require('../modules/dashboard'));
route.use('/api/dashboard', require('../modules/dashboard/api'));

// route.use('/test', require('../modules/test'));

module.exports = route;
