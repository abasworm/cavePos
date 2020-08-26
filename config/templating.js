module.exports = {
    ViewShow : async (view,data,req,res)=>{
        let datax = {
            _AppTitle : "OPTIMUS PM",
            _AppTitleSmall : "OPTIMUS PM",
            _AppTitleAlias : "OPT",
            _Copyright : "2020 DN, template Admin LTE 3",
            _Version : "2.5.0",
            _UserName : req.session.fullname,
            _UserGroup : req.session.user_group,
            _UserRole : req.session.other_role,
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