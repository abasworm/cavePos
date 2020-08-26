const rest = require('../config/rest');

module.exports = {
	
	isLogin:  (role=[])=> {return async (req,res,next) =>{
		try{
			if(!role && !role.includes(req.session.usergroup)) throw new Error('Forbiden Access') 
			let id = req.session._id;
			let username = req.session.username;
			if(username){
				next();
			}else{
				res.redirect('/login');
			}
		}catch(err){
			res
			.status(403)
			.send('Forbiden Access');
		}
	}},
	
	isLoginAPI: (role=[])=>{return async (req,res,next) =>{
		try{
			if(!role && !role.includes(req.session.usergroup)) throw new Error('Forbiden Access') 
			let id = req.session._id;
			let username = req.session.username;
			let fullname = req.session.fullname;
			//console.log(req.session);
			if(username){
				// const auth_token =  await JWT.sign({id:id,fullname:fullname},process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
				//req.session.token = auth_token;

				next();
			}else{
				return rest.error('','Please Login To Process or Refresh',res);
			}
		}catch(err){
			res.sendStatus(401);
		}
	}},
	
	isLoginBTbl: (role=[])=>{return async (req,res,next) =>{
		try{
			let id = req.session._id;
			let username = req.session.username;
			let fullname = req.session.fullname;
			//console.log(req.session);
			if(username){
				// const auth_token =  await JWT.sign({id:id,fullname:fullname},process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
				//req.session.token = auth_token;

				next();
			}else{
				rest.btable(["Please Login or Refresh"],res);
			}
		}catch(err){
			res.sendStatus(401);
		}
    }
}};