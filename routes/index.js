var route = require('express').Router();

route.use('/dashboard', require('../modules/dashboard'));
route.use('/api/dashboard', require('../modules/dashboard/api'));

//USER MODULE
// route.use('/users', require('../modules/users'));
// route.use('/api/users', require('../modules/users/api'));

// route.use('/dm_view', require('../modules/dm_view'));
// route.use('/api/dm_view',require('../modules/dm_view/api'));

// route.use('/dm_atm', require('../modules/dm_atm'));
// route.use('/api/dm_atm',require('../modules/dm_atm/api'));

// route.use('/export', require('../modules/export'));

route.use('/eg_master', require('../modules/eg_master'));
route.use('/api/eg_master',require('../modules/eg_master/api'));

route.use('/atm', require('../modules/eg_atm'));
route.use('/api/atm',require('../modules/eg_atm/api'));

route.use('/form_fe', require('../modules/eg_form_fe'));
route.use('/api/form_fe',require('../modules/eg_form_fe/api'));

route.use('/eg_partner', require('../modules/eg_partner'));
route.use('/api/eg_partner',require('../modules/eg_partner/api'));

// route.use('/import', require('../modules/import'));
// route.use('/api/import',require('../modules/import/api'));

route.use('/test', require('../modules/test'));

module.exports = route;
