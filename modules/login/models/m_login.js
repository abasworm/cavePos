const conn = require('../../../config/dbconnect');

let Mdl = {
    getUser : async (username)=>{
        try{
            let sql = "SELECT * FROM c_user_engineer WHERE email = ? ;";
            let res = await conn.query(sql,[username]);
            return {
                status : true,
                data : res[0][0]
            }
        }catch(err){
            return {
                status : false,
                message: err.message
            };
        }
    }
}

module.exports = Mdl;