'use strict';

const conn = require('../../config/dbconnect');
const table_name =  'dm_main';
const primary_key = 'uid';


let Mdl = {
    getAll : async(param,custom = "", custParam = [])=>{
        try{
            let paramRes = [];
            let sqlParam = [];
            let sqlplus = "";
            if(param){
                for(let a in param){
                    sqlplus += " AND " + a + " = ? ";
                    sqlParam.push(param[a]);
                }
            }
            paramRes = sqlParam.concat(custParam);
            
            let sql = `SELECT * FROM ${table_name} WHERE is_deleted = 'N' ` +sqlplus + custom;
            let res = await conn.query(sql,paramRes);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }
    },

    getOne: async(param)=>{
        try{
            let paramRes = [];
            let sqlParam = [];
            let sqlplus = "";
            if(param){
                for(let a in param){
                    sqlplus += " AND " + a + " = ? ";
                    sqlParam.push(param[a]);
                }
            }
            
            let sql = `SELECT * FROM ${table_name} WHERE is_deleted = 'N' ` +sqlplus;
            let res = await conn.query(sql,sqlParam);
            return {
                status : true,
                data : res[0][0]
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }
    },

    insert : async (data)=>{
        try{
            let fieldHead = [];
            let fieldVal = [];
            
            if(!data) return false;
            for(var i in data){
               fieldHead.push(i);
               fieldVal.push(data[i]);
            }
            let qry = "INSERT INTO " + table_name + "(" + fieldHead.join(',') + ") VALUES('" + fieldVal.join("','") +"');";
            let res = await conn.query(qry);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    },

    update : async (id,data)=>{
        try{
            
            let fieldVal = [];
            let y = 0;

            if(!data) return false;
            let qry = "UPDATE " + table_name + " SET ";
            for(var i in data){
                if(y > 0) qry += " , ";
                qry += i + " = ? ";
                fieldVal.push(data[i]);
                y++;
            }
            qry += " WHERE " + primary_key + " = ? ";
            fieldVal.push(id);
            let res = await conn.query(qry,fieldVal);
            return {
                status : true,
                data : res[0]
            };
        }catch(err){
            //console.log(err);   
            return {
                status : false,
                message: err.message
            };
        }
    },

    del : async(id,by)=>{
        try{
            let qry = `UPDATE ${table_name} SET is_deleted = 'Y',modified_by = ? WHERE uid = ?`;
            let res = await conn.query(qry,[by,id]);
            return {
                status  :true,
                data    :res[0],
            }
        }catch(err){
            return {
                status  :false,
                message :err.message
            };
        }
    }

}

module.exports = Mdl;