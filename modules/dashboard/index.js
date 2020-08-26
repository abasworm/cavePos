const route = require('express').Router();
const view = require('../../config/templating');
const { isLogin } = require('../../middleware/auth');


let link = "dashboard";
let _layout = {
    title : 'Dashboard Ticket', 
    isAddForm : true,
    _link : link
};

route
    .get('/',isLogin([1,9]),async(req,res,next)=>{
        const _tabel_layout = {
            csrfToken: req.csrfToken(),
        };
        Object.assign(_layout,_tabel_layout);
        view.ViewShow(link + '/table',_layout,req,res);
    })

module.exports = route;