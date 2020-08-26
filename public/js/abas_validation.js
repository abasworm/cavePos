/**
*   @author by Aris Baskoro
*   @copyright 2020
*   *you can use it freely but please don't erase this notes header
*   basic validation mod by abasworw
*/
class validationJqBots {
    constructor() {
        this.fl = {};
        this.fe = "";
        this.fc = "";
        this.message = [`field ${this.nm}`];    
        this.results = true;
    }
    setField(field,name){
        this.fl[field] = {nm : name, message:[`field ${name}`]};
        this.fe = $(field).val();
        this.fc = field;
        return this;
    }
    isNumber() {
        if (!(/^[0-9]+$/).test(this.fe)) 
        this.fl[this.fc].message.push('harus berupa numeric');
        return this;
    };
    isEmail(){
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.fe))) 
        this.fl[this.fc].message.push('harus berupa email valid'); 
        return this;
    }
    isAlphanumeric(){
        if(!(/^[0-9a-zA-Z]|\s+$/).test(this.fe))
        this.fl[this.fc].message.push('harus berupa Alphanumeric');
        return this;
    }
    isAlphabhet(){
        if(!(/^[a-zA-Z]|\s+$/).test(this.fe))
        this.fl[this.fc].message.push('harus berupa Alphanumeric');
        return this;
    }
    isRequired(){
        if(this.fe === null || this.fe === undefined || this.fe === '')
        this.fl[this.fc].message.push('harus di isi');
        return this;
    }
    isMatch(field,name){
        if(this.fe !== $(field).val())
        this.fl[this.fc].message.push('harus sesuai dengan field '+ name);
        return this;
    }
    min(c){
        if(this.fe.length < c)
        this.fl[this.fc].message.push('Minimal Karakter '+ c);
        return this;
    }
    max(c){
        if(this.fe.length > c)
        this.fl[this.fc].message.push('Maksimal Karakter '+ c);
        return this;
    }

    runValidation(){
        this.results = true;
        for(let i in this.fl){
            let imsg = i+"_message";
            if(this.fl[i].message.length>1){
                console.log(i)
                $(i).parents('.form-group')
                    .removeClass('has-success')
                    .addClass('has-error')
                $(imsg).remove();
                $(`<span id="${imsg.replace("#","")}" class="help-block"></span>`)
                    .insertAfter(i)
                    .html("*"+this.fl[i].message.join(', ')+".")
                this.results = false;
            }else{
                $(i).parents('.form-group')
                    .removeClass('has-error')
                    .addClass('has-success')
                $(imsg).remove();
            }
        }
    }

    errorField(field,message_field,name,message){
        $(field).parents('.form-group')
            .removeClass('has-success')
            .addClass('has-error')
        $(message_field).remove();
        $(`<span id="${message_field.replace("#","")}" class="help-block"></span>`)
            .insertAfter(field)
            .html("* Field "+name+", "+message+".")
        this.results = false;
    }
    successField(field,message_field){
        $(field).parents('.form-group')
            .removeClass('has-error')
            .addClass('has-success')
        $(message_field).remove();
    }

    reset(){
        for(let i in this.fl){
            let imsg = i+"_message";
            $(i).parents('.form-group')
                .removeClass('has-success')
                .removeClass('has-error')
            $(imsg).remove();
        }
    }

    results(){
        return this.results;
    }
}