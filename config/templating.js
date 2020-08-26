module.exports = {
    ViewShow : async (view,data,req,res)=>{
        let datax = {
            _AppTitle : "POS SYSTEM",
            _AppTitleSmall : "POS SYS",
            _AppTitleAlias : "POS",
            _Copyright : "template Admin LTE 3",
            _Version : "1.0b",
            _UserName : req.session.fullname,
            _UserGroup : req.session.user_group,
            _UserRole : req.session.other_role,
            _Sience : req.session.since,
            _uriPath : req.path
        };
        await Object.assign(datax,data);
        try{
            await res.render(view,datax);
        }catch(err){
            res.send(404);
        }
    }
};