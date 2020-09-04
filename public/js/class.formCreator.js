class formCreate{
    constructor(formID,isMultiPart = false){
        this.formID = formID;
        this.name = "";
        this.platForm = {};
        this.multiPart = isMultiPart;
    }
  
    label(labelName, col){
        this.platForm[this.name].label = labelName;
        this.platForm[this.name].lcol = col;
        return this;
    }
  
    attribute(chain){
        this.platForm[this.name].attribute = chain;
        return this;
    }
    
    fInput(name,col){
        this.name = name;
        this.platForm[name] ={
            type: 'text',
            name: name,
            fcol : col,
        }
        return this;
    }
    
    fNumber(name,col){
        this.name = name;
        this.platForm[name] ={
            type: 'number',
            name: name,
            fcol : col,
        }
        return this;
    }

    fFile(name,col,typeFile){
        this.name = name;
        this.platForm[name] ={
            type: 'file',
            name: name,
            fcol : col,
        }
        this.platForm[name+"_display"] ={
            type: 'display',
            name: name+"_display",
            fcol : col,
        }
        return this;
    }

    fSelect(name,col,options={},selected=""){
        this.name = name;
        this.platForm[name] ={
            type: 'select',
            name: name,
            fcol : col,
            options :options,
            selected:selected
        }
        return this;
    }

    fText(name,col,textRow,textCol){
        this.name = name;
        this.platForm[name] ={
            type: 'textarea',
            name: name,
            fcol : col,
            attribute:{
                cols: textCol,
                rows: textRow
            }
        }
        return this;
    }

    setClass(val=""){
        this.platForm[this.name].class = val;
        return this;
    }
  
    formGroup(col){
        this.platForm[this.name].formGroup = col;
        return this;
    }

    generate(){
        let fields = [];
        
        for(let key in this.platForm){
            let data = this.platForm[key];
            let getAttr = ()=>{
                let res = "" ;
                for(let key in data.attribute){
                    res += `${key}="${data.attribute[key]}" `;
                }
                return res;
            };
            let getOption = (data={},selected="")=>{
                
                let res = "<option> - Pilih - </option>" ;
                
                for(let key in data){
                    let isSelected = (selected == key)?"selected='selected'":"";
                    res += `<option value="${key}" ${isSelected}>${data[key]}</option>`;
                    console.log(res);
                }
                return res;
            }
            let attr = (data.attribute)?getAttr():"";
            let fVal;
            //=======================================
            switch(data.type){
                default:
                  fVal = `<div class="${data.fcol}"><input type="${data.type}" name="${data.name}" id="f${data.name}" class="form-control ${data.class}" ${attr}></div>`;
                  break;
                case 'select': 
                  fVal = `<div class="${data.fcol}"><select name="${data.name}" id="f${data.name}" class="form-control ${(data.class)?data.class:""}" ${attr}>${getOption(data.options,data.selected)}</select></div>`;
                  break;
                case 'textarea':
                    fVal = `<div class="${data.fcol}"><textarea name="${data.name}" id="f${data.name}" class="form-control ${data.class}  ${attr}"></textarea></div>`;
                    break;
                case 'display': 
                  fVal = `<div class="form-group col-xs-6 upload-display">
                    <img id="${data.name}" src=""/ width="100%">
                    </div>`;
                  break;
            }
            //=======================================
            if(data.label){fVal = `<label class="${data.lcol}" for="${data.name}">${data.label}</label>` + fVal;}
            if(data.formGroup){fVal = `<div class="form-group ${data.formGroup}">${fVal}</div>`}
            fields.push(fVal);
        }

        return `
            <form id="${this.formID}" name="${this.formID}" class="form-horizontal" ${(this.multiPart)?"enctype='multipart/form-data'":""}>
                <input id="fuid" name="uid" type="hidden"/>
                <div class='box-body'>
                    <div id='alertbox' class='alert alert-warning'>
                        <a id='closeAlert' class='close btn btn-sm' href='javascript:;'><i class='fa fa-times'></i></a>
                        <div id='message'></div>
                    </div>
                    
                    <div class='row'>
                        <div class='col-xs-12'>
                            ${fields.join(" ")}
                        </div>
                    </div>
                </div>
            </form>
        `;
    }
}