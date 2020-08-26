'use strict';

window.addEventListener('online',updateStats);
window.addEventListener('offline',updateStats);

function updateStats(e){
    if(navigator.onLine){
        toastr.success('Anda sudah Kembali Online.');
    }else{
        toastr.error('Anda sedang Offline.');
    }
}

let $tbl =  $('#dt_table');
let $modal = $('#modal_form');
let ab = new validationJqBots();
const genC = (e)=>{
    $('#eg_code').val(generateCode($('#eg_name').val(),$('#eg_partner').val()));
};

$(document).ready((e)=>{
    $('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
    });
    postFix(`/api/${_link}/table/head`,{},(res,ret)=>{
        if(ret!='success'){toastr.warning("Error with status : "+ret);return false;}
        if(!res.responseJSON.status) {toastr.error(res.responseJSON.message);return false;}
        initTable(res.responseJSON.results.tbls);
    })
});

function pwd(id){
    ab.reset();
    _x.ajax.getEditData(id);
    $('#pass').show();
    $('#btn_check').hide();
    $('[name^=eg_]:not(#eg_password,#eg_confpassword)').attr('disabled',true);
    
    $('#btn_u')
        .html('Change Password')
        .click((e)=>{_x.ajax.pwd()})
    $('input[name^=eg_]').keyup(()=>{
        ab
            .setField('#eg_password','Password').isRequired().min(5).max(20)
            .setField('#eg_confpassword','Confirm Password').isMatch('#eg_password','Password').isRequired()
            .runValidation();
    });
}

function proses(id){
    ab.reset();
    _x.ajax.getEditData(id);
    $('#pass').hide();
    $('#btn_check').hide();
    $('[name^=eg_]:not(#eg_password,#eg_confpassword)').attr('disabled',false);
    $('#eg_code').attr('readonly',true);
    $('#btn_u')
        .html('Update')
        .click((e)=>{_x.ajax.update()})
    $('input[name^=eg_]').keyup(()=>{
        ab
            .setField('#eg_email','Email').isRequired().isEmail()
            .setField('#eg_name','Nama Lengkap').isRequired().isAlphanumeric()
            .setField('#eg_customer_no','Nomor Customer').isRequired().isNumber().min(5)
            .setField('#eg_street','Location').isRequired()
            .setField('#eg_area_code','Kode Area').isRequired()
            .setField('#eg_fsl_code','Kode FSL').isRequired()
            .runValidation();
    })    
}

function del(id){
    if(confirm('Yakin ingin menghapus data?')){
        _x.ajax.del(id);
    }
}

function initTable(table_head){
    let data_column = [];
    for(let ir in table_head){
        let psr = {};
        switch(ir){
            case 'uid':
                psr = {
                    field: ir,
                    title: table_head[ir],
                    sortable:false,
                    align:"center",
                    formatter:(value,row,index)=>{
                        return `
                        <div class="btn-group">
                            <a class="button-group-item btn btn-primary btn-xs" href="javascript:proses('${value}')"><i class="fa fa-edit"></i> Proses</a>
                        </div>
                        `;
                    }
                }
                break;
            case 'open_ticket':
                psr = {
                    field: ir,
                    title: table_head[ir],
                    sortable:true,
                    sortOrder: "desc",
                    formatter:(value,row,index)=>{
                        return toDateString(value);
                    }
                }
                break;
            default:
                psr = {
                    field: ir,
                    title: table_head[ir],
                    sortable:true
                }
                break;
        }
        data_column.push(psr);
    }

    $tbl.bootstrapTable({
        url:`/api/${_link}/list`,
        showColumns : true,
        showExport:true,
        ajaxOptions:{
            beforeSend:(xhr)=>{
                xhr.setRequestHeader('CSRF-Token',document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
            }
        },
        showToggle : true,
        showRefresh: true,
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
        pagination:true,
        search:true,
        height:460,
        columns: data_column
    })

    window.ajaxOpt = {
        beforeSend:(xhr)=>{
            xhr.setRequestHeader('CSRF-Token',document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
        }
    }
}

const xapi 