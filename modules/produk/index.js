const route = require('express').Router();
const view = require('../../config/templating');
const { isLogin } = require('../../middleware/auth');

let link = "produk";
let _layout = {
    title : 'Management Produk', 
    isAddForm : true,
    _link : link
};

String.prototype.capitalize = function(){return this.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());};
String.prototype.underscoreToSpace = function(){return this.replace(/\_/g," ");};

route
.get('/',isLogin([1,9]),async(req,res,next)=>{
    //declare for columns
    let columns = {};

    //list of field table atm
    const listField = [
        'uid',
        'sku',
        'nama',
        'kategori',
        'harga_modal',
        'harga_jual',
        'satuan'
    ];

    const fieldRequired = [
        'nama',
        'sku',
        'kategori_id',
        'harga_modal',
        'harga_jual',
        'satuan'
    ]

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

    for(let field of listField){
        columns[field] = field.underscoreToSpace().capitalize();
    }

    const _table_layout = {
        csrfToken: req.csrfToken(),
        tbls : columns,
        fieldRequired: fieldRequired,
        fieldToChange : fieldToChange
    };
    Object.assign(_layout,_table_layout);
    view.ViewShow(link + '/table',_layout,req,res);
})

module.exports = route;