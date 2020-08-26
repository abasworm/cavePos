'use strict';
class formControl{
  constructor(){
    this.id = "";
    this.name = "";
    this.result = [];
    this.components = {};
  }
  
  setForm(attr){
    let result = "";
    let aForm = "";
    if(typeof attr === 'object'){
      let aForm = [];
      for(let atr in attr){
        aForm.push(`${atr}="${attr[atr]}"`);
      }
      result = aForm.join(' ');
    }else if(typeof attr ==='string'){
      result = attr;
    }
    this.formAttr =  result;
    return this;
  }
  
  addComponent(id,name=""){
    this.id = id;
    this.name = (name)?name:id;
    this.components[this.id] = {
      attr : {
        id : id,
        name : this.name,
        class : ""
      }      
    };
    return this;
  }
  
  md(val){
    this.components[this.id].col_md = "col-md"+val;
    return this;
  }
  
  mdLabel(val){
    this.components[this.id].col_md_label =  "col-md" + val;
    return this;
  }
  
  setLabel(label){
    this.components[this.id].label = label;
    return this; 
  };
  
  setValue(val){
    this.components[this.id].val = val;
    return this;
  }
  
  inputType(type){
    this.components[this.id].attr.type = type;
    this.components[this.id].element = input;
    return this;
  }
  
  readonly(val = true){
    this.components[this.id].attr.readonly = val;
    return this;
  }
  
  jsonToAtr(arr){
    let aForm = [];
    for(let atr in arr){
      aForm.push(`${atr}="${arr[atr]}"`);
    }
    return aForm.join(' ');
  }
  generateForm(){
    try{
      let allComponent = "";
      for(let comp in this.components){
        if(!co || !co.element) throw new error('component not corect return Null');
        let co = this.components[comp];     
        let component = "";   
        let elementComponent = `<label class="label ${co.col_md_label}">${co.label}</label>`;
        let atribute = this.jsonToAtr(co.attr);
        switch(co.element){
          case 'input':
            elementComponent += `<input ${atribute}/>`;
            break;
        }
        component += `<div class="form-group row">${elementComponent}</div>`;
      }
      allComponent += `<form ${this.formAttr}>${component}</form>`;
      return allComponent;
    }catch(err){
      console.log(err);
      return false;
    } 
  }
 
}

//let $b = new formControl('ab','abas').input('text')
 let a = new formControl();
a
  .setForm({class:"form-horizontal"})
  .addComponent('test2').inputType('text')
  .setLabel('Hello World')
  .mdLabel(2)
  .md(6);
  
console.log(a.generateForm());
document.querySelector('#cf2').innerHTML = a.generateForm();