////////////////////////////////////////////////////////////////////////////////

function toDateString(s){
    var d = new Date(s);
    Number.prototype.padLeft = function(base,chr){
        var  len = (String(base || 10).length - String(this).length)+1;
        return len > 0? new Array(len).join(chr || '0')+this : this;
    }
    var dformat = [d.getFullYear(),(d.getMonth()+1).padLeft(),
        d.getDate().padLeft()].join('-')+
        ' ' +
      [ d.getHours().padLeft(),
        d.getMinutes().padLeft(),
        d.getSeconds().padLeft()].join(':');
    return dformat;
}

////////////////////////////////////////////////////////////////////////////////
/**
 * send the post ajax form
 * Content-Type: application/json with the CSRF token send
 * @param String url 
 * @param String data 
 * @param Callback(res,ret) completes 
 */
async function postFix(url,data,completes,isMultipart=false){
    let config = {
        url: url,
        type: 'POST',
        data: data,
        headers: {
            'CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        dataType: 'json',
        complete: completes,
        statusCode: {
            404: function(){toastr.error('Page Not found')},
            403: function(){toastr.error('Forbiden Access.')},
            500: function(){toastr.error('Internal Server Error')}
        }
    };

    if(isMultipart){
        //config.type = 'multipart/form-data';
        config.contentType = false;
        config.processData = false;
    }
    await $.ajax(config)
    .fail(()=>{
        alert('Error encounterd, please check your data or refresh.');
    })
}

/////////////////////////
/**
 * jquery function to use readonly
 * @param Boolean value
 * return readonly on input
 */
/////////////////////////
(function($){
    $.fn.readonly = function(value=true){(value === true)?this.attr('readonly',true):this.removeAttr('readonly');}
    $.fn.disabledAttr= function(value=true){(value === true)?this.attr('disabled',true):this.removeAttr('disabled');}
})(jQuery);



/////////////////////////
/**
 * prototype for String
 */
/////////////////////////

String.prototype.capitalize = function(){return this.toString().replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());};
String.prototype.underscoreToSpace = function(){return this.replace(/\_/g," ");};