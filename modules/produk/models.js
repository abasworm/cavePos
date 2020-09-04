'use strict';

const conn = require('../../config/dbconnect');
const sqlBuild = require('../../config/sql-builder');
const table_name =  'm_produk';

let Mdl = {
    getAll: async (fieldToView)=>{
        try{
            const sql = new sqlBuild();
            const {query,array} = sql
                .select(fieldToView)
                .from(table_name)
                .where('m_produk.is_deleted','N')
                .joinQ('m_kategori','m_produk.kategori_id','m_kategori.id','inner')
                .get();
            console.log(query);
            const data = await conn.query(query,array);
            return {
                status : true,
                data : data[0],
                message: "success"
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }        
    },

    getOne: async (fieldToView,parameter={})=>{
        try{
            const sql = new sqlBuild();
            const{query,array} = sql
                .select(fieldToView)
                .from(table_name)
                .where('is_deleted','N')
                .where(parameter)
                .get();
            const data = await conn.query(query,array);
            console.log(query);
            return {
                status : true,
                data : data[0][0],
                message: "success"
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }
    },

    delete : async(parameter={})=>{
        try{
            const sql = new sqlBuild();
            const{query,array} = sql
                .where(parameter)
                .update(table_name,{is_deleted:'Y'});
            const data = await conn.query(query,array);
            console.log(query,array);
            return {
                status : true,
                data : data[0], 
                message: "success"
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }
    },
    delete_permanent: async (parameter={})=>{
        try{
            const sql = new sqlBuild();
            const{query,array} = sql
                .where(parameter)
                .delete(table_name);
            const data = await conn.query(query,array);
            return {
                status : true,
                data : data,
                message: "success"
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }
    },

    insert: async(data={})=>{
        try{
            const sql = new sqlBuild();
            const{query,array} = sql
                .insert(table_name,data);
            const datas = await conn.query(query,array);
            return {
                status : true,
                data : datas, 
                message: "success"
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }
    },

    update: async(datas={},parameter={})=>{
        try{
            const sql = new sqlBuild();
            const{query,array} = sql
                .where(parameter)
                .update(table_name,datas);
            const data = await conn.query(query,array);
            console.log(query,array);
            return {
                status : true,
                data : data[0], 
                message: "success"
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }
    },

    getFields : async(datas=[])=>{
        try{
            const sql = new sqlBuild();
            const {query,array} = sql.getDescription(table_name,datas);
            const data = await conn.query(query,array);
            return {
                status : true,
                data : data, 
                message: "success"
            };
        }catch(err){
            return {
                status : false,
                data: [],
                message: err.message
            };
        }
    },

    
}

module.exports = Mdl;