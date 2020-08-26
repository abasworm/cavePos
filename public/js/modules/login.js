var username;
var password;
$(document).ready(function(e){
    username = $('#username');
    password = $('#password');
    $('#btn_login').on('click', function(e){
        e.preventDefault();
        $(this).attr('disabled',true);
        $(this).html('Verification..');
        signin();
    });

    $('#alertbox').hide();
    $('#closeAlert').on('click', function(e){
        $('#alertbox').hide();
    });
})

function signin(){
    postFix('/login/verify',{key:'abcdh',username:username.val(),password:password.val()},(res,ret)=>{
        console.log(res.responseJSON);
        if(!res.responseJSON.status){
            $('#alertbox #message').html(res.responseJSON.message);
            $('#alertbox').show();
            $('#btn_login').attr('disabled',false);
            $('#btn_login').html('Sign In');
        }else{
            window.location = '/dashboard';
        }
    });
}