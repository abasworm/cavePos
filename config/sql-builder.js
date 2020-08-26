/**
 * SQL Builder,
 * build like codeginiter,
 * version 1.2 2020,
 * Author Aris Baskoro a.k.a abas
 */
class SqlBuilder{
    constructor(){
      this.query = {};
      this.query.selectQry = "";  
      this.query.tableQry = "";
      this.query.joinQry = "";
      this.query.whereQry = "";
      this.query.limitQry = "";
      this.query.groupByQry = "";
      this.query.orderByQry = "";
      this.query.havingQry = "";
      
      this.arrayQry = [];
      this.checkVar = (le) =>{
        let r = le.replace(/[\t\r\n\']|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)+/gi,"\\$&");
        return r;
      }
    }
    
    /** 
    * Selection field with param extention
    * @param String qry
    */
    select(qry){
      if(!qry) return this.errorQ("select number must array or string");
      qry = (Array.isArray(qry))?qry.join(','):qry;
      this.query.selectQry = `SELECT ${qry}`;
      return this;
    }
    
    /** 
    * From name of the table
    * @param String table
    */
    from(table){
      this.query.tableQry = `FROM ${table}`;
      return this;
    }
    
    /**
    * Join between 2 table result
    * eg: join("foo","goo1","goo2","inner")
    * will result "INNER JOIN foo ON goo1 = goo2"
    * @param String table_target
    * @param String field_source
    * @param String field_target
    * @param String relation e.g: inner, outer, left, right
    */
    joinQ(table_target,field_source,field_target,relation){
      this.query.joinQry = `${relation.toUpperCase()} JOIN ${table_target} ON ${field_source} = ${field_target}`;
      return this;
    }
    
    /**
     * seting where with AND portion
     * @param String|Object data 
     * @param String value
     */
    where(data,value=null){
      this.paramQ(data,value,"AND","=");
      return this;
    }
    or_where(field,value=null){
      this.paramQ(data,value,"OR","=");
      return this;
    }
    like(field,value=null){
      this.paramQ(data,value,"AND","LIKE");
      return this;
    }
    or_like(field,value=null){
      this.paramQ(data,value,"OR","LIKE");
      return this;
    }
    where_in(field,value=[],decision="AND"){
      if(this.query.whereQry == "" || !this.query.whereQry) this.query.whereQry += "WHERE ";
      if(this.query.whereQry != "" || this.query.whereQry) this.query.whereQry += ` ${decision} `;
      if(!Array.isArray(value) || value.length<1) return this.errorQ("value must be an Array and not NULL");
      if(!field) return this.errorQ("field must be set.");
      let arr=[];
      for(let i in value){
        arr.push("?");
        this.arrayQry.push(value[i])
      };
      this.query.whereQry += `${field} IN (${arr.join(",")})`;
      return this;
    }

    where_not_null(field){
      if(this.query.whereQry == "" || !this.query.whereQry) this.query.whereQry += "WHERE ";
      this.query.whereQry += `${field} IS NOT NULL`;
      return this;
    }

    /**
     * Create between Query
     * @param String field 
     * @param String value_start 
     * @param String value_end 
     * @param String decision 
     */
    between(field,value_start,value_end,decision="AND"){
      if(this.query.whereQry == "" || !this.query.whereQry) this.query.whereQry += "WHERE ";
      if(this.query.whereQry != "" || this.query.whereQry) this.query.whereQry += ` ${decision} `;
      this.query.whereQry += `(${field} BETWEEN ${value_start} AND ${value_end})`;
      return this;
    }

    /**
     * seting where with AND portion
     * @param String|Object data 
     * @param String value
     */
    paramQ(data,value=null,decision='AND',compare='='){
      if(this.query.whereQry == "" || !this.query.whereQry) this.query.whereQry += "WHERE ";
      if(!value && (typeof data == 'object') && !Array.isArray(data)){
        for(let field in data){
          if((this.query.whereQry != "" || this.query.whereQry) && /(\=)/.test(this.query.whereQry)) this.query.whereQry += ` ${decision} `;
          this.query.whereQry += `${field} ${compare} ?`;
          this.arrayQry.push(data[field]);
        }
      } else if(value && (typeof data == 'string')) {
        if((this.query.whereQry != "" || this.query.whereQry) && /(\=)/.test(this.query.whereQry)) this.query.whereQry += ` ${decision} `;
        this.query.whereQry += `${data} ${compare} ?`;
        this.arrayQry.push(value);
      }else{
        return this.errorQ(`value of '${data}' isn't recognized`);
      }
    }

    errorQ(msg){
      return new Error(msg);
    }
    
    /**
     * get data
     * @returns Object {query and array}
     */
    get(){
      //initiate variable
      let q = this.query;
      let arrayQuery=[];
      
      //check mandatory
      if(!q.selectQry || !q.tableQry) return this.errorQ("Error Select or From Query not set.")
      
      //combine query in array
      arrayQuery.push(q.selectQry,q.tableQry,q.joinQry,q.whereQry);
      
      //clean quary Array
      for(let a in this.query){
        this.query[a] ="";
      }
      
      //return string and array
      return {query: arrayQuery.join(" ").trim(), array: this.arrayQry};
    }

    //--- Manipulation Data ---//
    /**
     * Create QUery insert
     * @param String table 
     * @param Object datas 
     */
    insert(table,datas){
      if(!datas) return this.errorQ("Data must be set");
      if(!table) return this.errorQ("Tables must be set as string.");
      if(typeof datas !="object") this.errorQ("Data must be set an object");
      let fields = [];
      let values = [];
      let qMark = [];

      for(var data in datas){
        let field = data;
        let value = datas[data];
        fields.push(field);
        values.push(value);
        qMark.push("?");
      }

      let query = `INSERT INTO ${table}(${fields.join(', ')}) VALUES(${qMark.join(', ')})`;
      return {query: query, array:values};
    };

    /**
     * Create QUery Update
     * @param String table 
     * @param Object datas 
     */
    update(table,datas){
      if(!datas) return this.errorQ("Data must be set");
      if(!table) return this.errorQ("Tables must be set as string.");
      if(!this.query.whereQry) return this.errorQ("Parameter not set, please use at least one 'where' function.");
      if(typeof datas !="object") return this.errorQ("Data must be set an object");
      let fields = [];
      let values = [];
      
      for(var data in datas){
        let field = data;
        let value = datas[data];
        fields.push(`${field} = ?`);
        values.push(value);
      }
      
      let query = `UPDATE ${table} SET ${fields.join(', ')} ${this.query.whereQry}`;
      console.log(query);
      return {query: query, array:values.concat(this.arrayQry)};
    };

    /**
     * Create QUery Delete 
     * @param String Table 
     */
    delete(table){
      if(!table) return this.errorQ("Tables must be set as string.");
      if(!this.query.whereQry) return this.errorQ("Parameter not set, please use at least one 'where' function.");

      let query = `DELETE FROM ${table} ${this.query.whereQry}`;
      return {query: query, array:this.arrayQry};
    };

    /**
     * for getting Description of Data
     * i'm so sleepy -_-
     * @param String table 
     * @param Array datas 
     */
    getDescription(table,datas=[]){
      if(!datas) return this.errorQ("Data must be set");
      if(!table) return this.errorQ("Tables must be set as string.");
      if(Array.isArray(datas)) this.errorQ("Data must be set an object");
      let fields = [];
      let qMark = [];

      for(var data in datas){
        let field = datas[data];
        fields.push(field);
        qMark.push("?");
      }

      let query = `SHOW COLUMNS FROM ${table} WHERE FIELD IN (${qMark.join(",")})`;
      return {query: query, array:fields};
    };
    
  }

  module.exports = SqlBuilder;