//'use strict';

//--  begin toaster --//
//to know is user online or offline
window.addEventListener('online',updateStats);
window.addEventListener('offline',updateStats);
function updateStats(e){ (navigator.onLine) ? toastr.success('Anda sudah Kembali Online.'): toastr.error('Anda sedang Offline.');}
//-- end toaster --//

//prevent windows close before saving
window.onbeforeunload = function() {
    if (!_checkHasChanged()) {
        return "Do you really want to leave our brilliant application?";
    } else {
       return;
    }
 };
 function _checkHasChanged(){
     for(let key of _fieldToChange){
        let a = ($(`#fmain #f${key}`).data('valueBefore')==null)?"":$(`#fmain #f${key}`).data('valueBefore');
        let b = $(`#f${key}`).val();
        if(b == null){b = a}
        if(a != b){
            console.log([key,a, b])
            return false;
        }
     }
     return true;
 }

//name form
const FormName = 'fmain';

//initiate table
const $tbl =  $('#dt_table');

//initiate modal form and button
const $modalForm = $('#modal_form');

//initiate button
const $buttonAction = $('#btn_u');

//initiate class validation
const validationForm = new validationJqBots();

//-- begin document ready --//
$(document).ready(async (e)=>{
    // this step is create form
    // add this on top of document ready function
    const cForm = new formCreate(FormName); // create new class
    let colLabel = 'col-md-4';
    let colInput = 'col-md-8';
    let statusOption = {
        1 : "WORKING",
        2 : "NOT WORKING"
    }

     let cFormField; // variable to save form

    // Loop for set field by name
    for(field of _fieldToChange){
        let fieldName = field.underscoreToSpace().capitalize();
        switch(field){
            case 'image_path' :
                cForm
                .fFile('image_path',colInput,statusOption,'')
                .label('Upload Files',colLabel)
                .formGroup('col-xs-6')
                .attribute({
                    accept: 'image/jpeg,image/png,image/tiff',
                    onchange: 'loadImageFile(this.id);',
                });
                break;

            case 'kategori_id':
                cForm
                .fSelect(field,colInput,statusOption,'')
                .label("Kategori",colLabel)
                .formGroup('col-xs-6');
                break;
            
            case 'produk_favorit':
                cForm
                .fSelect(field,colInput,{'Y':"YA",'N':"Tidak"},'Y')
                .label("Produk Favorit",colLabel)
                .formGroup('col-xs-6');
                break;
            
            default   :
                cForm
                .fInput(field,colInput)
                .label(fieldName,colLabel)
                .formGroup('col-xs-6');
                break;
        }
        
    }
    cFormField = cForm.generate(); // generate form
    document.querySelector('#formField').innerHTML = cFormField;  //place the form

    // Date Picker or datetime picker
    $('.datetimepicker').datetimepicker({format:"YYYY-MM-DD HH:mm:ss"});
    $('.datepicker').datepicker({autoclose : true,format: 'yyyy-mm-dd'});


    // get status send PM
    // await postFix(`/api/pm_status/list/array/group/2`,{},(res,ret)=>{

    // });

    //prevent submit form
    $(`#${FormName}`).submit(function(e){
        e.preventDefault();
    });

    //click action to button
    $buttonAction.click(async function(){
        //prevent double clicked
        $buttonAction.disabledAttr();       
        
        //initiate button
        initButtonAction();
    });

    //initiate Alert 
    await initAlertBox();

    //initiate table
    initTable();
});

//==========================================================
//  Function that can be different each form
//  Don't change the name of function
//  change only inside of the function
//==========================================================

//reset form to default value
async function resetForm(readonlyField){
    for(let field of _fieldToChange){
        switch(field){
            case 'image_path':
                await $('#fimage_path').val('');
                await $('#image_path_display').attr('src','');
                break;
            case 'produk_favorit':
                await $(`#fproduk_favorit`).val('N').readonly(false);
            default:
                await $(`#fmain #f${field}`).val('').readonly(false);
                break;
        }
    }
}

async function validateAdd(evt){
    for(field of _fieldRequired){
        validationForm
            .setField(`#f${field}`,field.underscoreToSpace().capitalize())
            .isRequired();
    }
    validationForm.runValidation();
}

async function validateEdit(evt){
    for(field of _fieldRequired){
        validationForm
            .setField(`#f${field}`, field.underscoreToSpace().capitalize())
            .isRequired();
    }
    validationForm.runValidation();
}

async function completeEdit(results){
    for(let key in await results){
        if(key == 'image_path'){
            $('#image_path_display').attr('src',results[key]);
        }else{
            $(`#f${key}`).val(results[key]);
            $(`#f${key}`).data('valueBefore',results[key]);
        }
    }
}

async function completeView(results){
    for(let key in await results){
        if(key == 'image_path'){
            $('#image_path_display').attr('src',results[key]);
        }else{
            $(`#f${key}`).readonly();
            $(`#f${key}`).val(results[key]);
        }
    }
}

//generate header of table
async function generateColumnOption(){
    //don't change this properties
    let fieldColumnOption = [];

    //looping for header of table and content of tables
    for(let key in _table_head){
        let fieldOptions = {};
        switch(key){
            // you can change bellow
            // use :
            // variable 'fieldOptions' to adding field
            // variable 'key' is the name of field
            // variable '_table_head[key]' is the value / title of the field to show
            // ============================ BEGIN ============================
            case 'uid':
                fieldOptions = {
                    field: key,
                    title: 'Aksi',
                    sortable:false,
                    width:200,
                    align:"center",
                    formatter:(value,row,index)=>{
                        return `
                        <div class="btn-group">
                            <a class="button-group-item btn btn-primary btn-xs" href="javascript:edit('${value}')"><i class="fa fa-edit"></i> Edit</a>
                            <a class="button-group-item btn btn-success btn-xs" href="javascript:view('${value}')"><i class="fa fa-eye"></i> View</a>
                            <a class="button-group-item btn btn-danger btn-xs" href="javascript:del('${value}')"><i class="fa fa-trash"></i> Del</a>
                        </div>
                        `;
                    }
                }
                break;
            
            default:
                fieldOptions = {
                    field: key,
                    title: _table_head[key],
                    sortable:true
                }
                break;
            // ============================ END ============================
        }
        fieldColumnOption.push(fieldOptions);
    }
    return fieldColumnOption;
}

//==========================================================
//  Function form handle
//==========================================================

//add function handle
async function add(){
    $("#fid").val("");
    //enable button
    $buttonAction.disabledAttr(false);

    //reseting validation
    validationForm.reset();

    //show modal
    await $modalForm.modal({
        backdrop: 'static',
        keyboard: false
    });

    //button change click 
    $buttonAction.html('Save');

    //form main changed
    $("#fmain").change(validateAdd);

    //reset form
    await resetForm();
}

async function edit(id){
    $("#fid").val(id);

    //enable button
    $buttonAction.disabledAttr(false);

    //reseting validation
    validationForm.reset();

    //call ajax
    _x.ajax.edit(id);

    //show modal
    $modalForm.modal({
        backdrop: 'static',
        keyboard: false
    });
    //button change click 
    $buttonAction.html('Update');

    //reset form
    await resetForm();

    //form main changed
    $("#fmain").change(validateEdit);
    
}

//view detail of data
async function view(id){
    //enable button
    $buttonAction.disabledAttr(false);

    //reseting validation
    validationForm.reset();
    
    //call ajax
    _x.ajax.detail(id);

    //show modal
    $modalForm.modal('show');

    //button change click 
    $buttonAction.html('Ok');

    //reset form
    await resetForm();
}

//delete from table
function del(id){confirm("Yakin ingin hapus data?") && _x.ajax.del(id);}


//==========================================================
//  initiatable function
//==========================================================

//initiate function for alert box
async function initAlertBox(){
    $('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});
}

//initiate function for table
async function initTable(){
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
        height:600,
        columns: await generateColumnOption()
    })

    // window.ajaxOpt = {
    //     beforeSend:async (xhr)=>{
    //         await xhr.setRequestHeader('CSRF-Token',document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
    //     }
    // }
}

//Button action running different action
async function initButtonAction(){
    try{
        switch ($buttonAction.html().toLowerCase()){
            case 'save': 
                await _x.ajax.insert();
                console.log('ho') 
                break;
            case 'update': 
                await _x.ajax.update(); 
                console.log('ho') 
                break;
            case 'ok': 
                await $modalForm.modal('hide'); 
                console.log('ho') 
                break;
        }
    }catch(err){
        console.log(err)
    }
}

//==========================================================
//  ajax function
//==========================================================

const _x = {

    //function ajax
    ajax:{
        edit:(id)=>{postFix(`/api/${_link}/edit`,{id:id},_x.complete.edit);$('#fuid').val(id)},
        detail:(id)=>{postFix(`/api/${_link}/edit`,{id:id},_x.complete.view)},
        insert:async ()=>{
            const form = document.getElementById(FormName);
            const formToUpload = new FormData(form);
            const imgUrl = $('#image_path_display').prop('src');
            
            if(imgUrl){
                const block = imgUrl.split(";");
                const contentType = block[0].split(':')[1];
                const realData = block[1].split(',')[1];
                const blob = base64toBlob(realData,contentType);
                formToUpload.append('upload_file',blob);
                formToUpload.delete('image_path');
            }else{
                formToUpload.append('upload_file','');
            }
                              
            validationForm.results && await postFix(
                `/api/${_link}/insert`,
               formToUpload,
               _x.complete.send,
               true //isMultipart
            );
        },
        update:async ()=>{
            const form = document.getElementById(FormName);
            const formToUpload = new FormData(form);
            const imgUrl = $('#image_path_display').prop('src');
            
            if(imgUrl.indexOf(',')>=0){
                const block = await imgUrl.split(";");
                const contentType = await block[0].split(':')[1];
                const realData = await block[1].split(',')[1];
                const blob = await base64toBlob(realData,contentType);
                console.log(blob);
                formToUpload.append('upload_file',blob);
                formToUpload.delete('image_path');
            }else{
                const blob = new Blob('',{type:"image/jpeg"})
                formToUpload.append('upload_file','');
            }

            validationForm.results && await postFix(
                `/api/${_link}/update`,
               formToUpload,
               _x.complete.send,
               true //isMultipart
            );
        },
        del:(id)=>{postFix(`/api/${_link}/delete`,{id:id},_x.complete.send)},
    },

    //function when ajax is complete
    complete:{
        edit: async (res,ret)=>{
            //check return is available
            if(!res) return _x.showError("No return value available.");
            
            //check status of response form server
            if(ret!="success") return _x.showError(`Status : ${ret}`);
            
            //convert response to variable;
            const {status,message,results} = await res.responseJSON;
            
            //if error from server then return message
            if(!status){return _x.showError(message)}else{

                //showing modal dialog
                $modalForm.modal('show');
                
                //loop result to field
                await completeEdit(results);            
            }           
        },

        view: async (res,ret)=>{
            //check return is available
            if(!res) return _x.showError("No return value available.");
            
            //check status of response form server
            if(ret!="success") return _x.showError(`Status : ${ret}`);
            
            //convert response to variable;
            const {status,message,results} = await res.responseJSON;

            //if error from server then return message
            if(!status){return _x.showError(message)}else{

                //showing modal dialog
                $modalForm.modal('show');

                //loop result to field
                await completeView(results);            
            }
        },

        send: async (res,ret)=>{
            //check result is available
            if(!res) return _x.showError("No return value available.");

            //check status of response form server
            if(ret!="success") return _x.showError(`Status : ${ret}`);

            //convert response to variable;
            const {status,message,results} = await res.responseJSON;

            //if error from server then return message
            if(!status){$buttonAction.disabledAttr(false);return _x.showError(message);}else{

                //popup toast message
                toastr.success(message);

                //hide modal form
                $modalForm.modal('hide');

                //table refresh
                $tbl.bootstrapTable('refresh');
            }
        },
        
    },

    //function if ajax error
    showError:(message)=>{
		$('#alertbox #message').html(message);
        $('#alertbox').show();
        toastr.warning(message);
        return false;
    }
}

/**
 * FORM UPLOAD viewer / display
 */
// function readURL(input) {
//     let imginput = input.name+"_display";
//       if (input.files && input.files[0]) {
//           var reader = new FileReader();
//           reader.onload = function (e) {
//               $(`#${imginput}`)
//                   .attr('src', e.target.result);
//           };
//           reader.readAsDataURL(input.files[0]);
//       }
//   }