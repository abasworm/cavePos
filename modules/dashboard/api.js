const route = require('express').Router();
const auth = require('../../middleware/auth');
const { body , validationResult } = require('express-validator');
const uuid = require('uuid/v4');
const dbrecord = require('../../middleware/dbrecord');
const rest = require('../../config/rest');
const Mdl = require('./models');

const userGroup = [9,1];
const tbls = {
    uid       :'Aksi',
    ticket_crm:'Ticket',
    open_ticket: 'Ticket Created',
    status: 'Status',
    description  : 'Problem Description',
    atm_id : 'ID ATM',
    atm_sn  : 'SN',
    atm_location : 'Location',
    atm_area: 'Area',
    atm_spv: 'SPV'
};

route
.post('/table/head',auth.isLogin(userGroup),async(req,res,next)=>{
    let tables = {
        tbls : tbls
    }
    rest.success(tables,'Success create header',res);
})

.get('/list',auth.isLoginBTbl(userGroup),async (req,res,next)=>{
    try{
        if(!req.body) return res.sendStatus(400);
        const rb = req.body;
        let param = {}, custParam = [], cust = "";
        const fieldToShow = [];
        for(let fts in tbls){
            fieldToShow.push(fts);
        }
        cust += " AND status NOT IN('CLOSED','CANCELED')";
        cust += " ORDER BY open_ticket DESC";
        param.fs_engineer_number = req.session.engineer_no;
        let result = await Mdl.getAll(param,cust,custParam);
        if(!result.status) await rest.error('',result.message,res);
        const data = result.data;
        rest.btable(dbrecord.manyRecord(data,fieldToShow),res);
    }catch(err){
        console.log(err);
        rest.btable({},res);
    }
})

module.exports = route;
