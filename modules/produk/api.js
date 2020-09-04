const route = require('express').Router();
const auth = require('../../middleware/auth');
const { body, check , validationResult } = require('express-validator');
const uuid = require('uuid/v4');
const bcrypt = require('bcryptjs');
const rest = require('../../config/rest');
const Mdl = require('./models');

//multer upload data
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, './uploads');
    },
    filename: (req,file,cb)=>{
        cb(null,'produk_'+Date.now()+'.jpg');
    }
});


const upload = multer({storage:storage});

const userGroup = [1,9]; // only administrator dan partner

const fieldToView = [
    'm_produk.uid',
    'sku',
    'nama',
    'kategori',
    'harga_modal',
    'harga_jual',
    'satuan'
];

const fieldToChange = [
    'sku',
    'nama',
    'kategori_id',
    'produk_favorit',
    'harga_modal',
    'harga_jual',
    'satuan',
    'image_path'
]

const validasiAPI = [
    check('sku').isLength({min:3}).withMessage("Minimal 3 karakter."),
    check('nama').isLength({min:4}).withMessage("Minimal 4 Karakter."),
    check('kategori').notEmpty().withMessage("mohon untuk pilih kategori."),
    check('harga_jual').notEmpty().withMessage("mohon di isi harga jual produk.")
];

route

.get('/list',auth.isLoginBTbl(userGroup),async(req,res,next)=>{
    
    try{
        let {status,data,message} = await Mdl.getAll(fieldToView);
        if(!status) return rest.error('',message,res);
        rest.btable(data,res);
    }catch(err){
        console.log(err)
        rest.btable({},res);
    }
})

.post('/edit',auth.isLoginAPI(userGroup),async(req,res,next)=>{
    if(!req.body.id) return res.sendStatus(400);
    try{
        let {status,data,message} = await Mdl.getOne(fieldToChange,{uid:req.body.id});
        if(!status) return rest.error('',message,res);
        rest.success(data,'success',res);
    }catch(err){
        rest.error({},"ERROR get Data",res);
    }
})

.post('/detail',auth.isLoginAPI(userGroup),async(req,res,next)=>{
    if(!req.body.id) return res.sendStatus(400);
    try{
        let {status,data,message} = await Mdl.getOne(fieldToView,{id:req.body.id});
        if(!status) return rest.error('',message,res);
        rest.success(data,'success',res);
    }catch(err){
        rest.error({},"ERROR get Data",res);
    }
})

.post('/delete',auth.isLoginAPI(userGroup),async(req,res,next)=>{
    if(!req.body.id) return res.sendStatus(400);
    try{
        let {status,data,message} = await Mdl.delete({uid:req.body.id});
        if(!status) return rest.error('',message,res);
        rest.success(data,'success',res);
    }catch(err){
        rest.error({},"ERROR Delete Data",res);
    }
})

.post('/insert',auth.isLoginAPI(userGroup),validasiAPI
, upload.single('upload_file')
, async(req,res,next)=>{
    if(!req.body) return res.sendStatus(400);
    try{
        let datas = {};
        for(let field of fieldToChange.filter(arr => arr != 'id')){
            datas[field] = req.body[field];
        }
        datas.uid = uuid();
        datas.created_by = req.session.username;
        datas.image_path = await (req.file)?req.file.path:"";
        let {status,data,message} = await Mdl.insert(datas);
        if(!status) return rest.error('',message,res);
        rest.success(data,'success',res);
    }catch(err){
        rest.error({},"ERROR insert Data",res);
    }
})

.post('/update',auth.isLoginAPI(userGroup),validasiAPI
, upload.single('upload_file')
, async(req,res,next)=>{
    console.log(req.body)
    if(!req.body) return res.sendStatus(400);
    try{
        console.log(req.file.path);
        let datas = {};
        for(let field of fieldToChange.filter(arr => arr != 'id')){
            datas[field] = req.body[field];
        }
        datas.image_path = await (req.file)?req.file.path:"";
        datas.modified_by = req.session.username;
        let {status,data,message} = await Mdl.update(datas,{uid:req.body.uid});
        if(!status) return rest.error('',message,res);
        rest.success(data,'success',res);
    }catch(err){
        rest.error(err,"ERROR update Data",res);
    }
});

module.exports = route;