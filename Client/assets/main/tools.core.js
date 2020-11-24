var tools = {
    urlServer:"http://localhost:3835",
    urlRoot: 'http://localhost:3835/api/ws/',
    
    formGET: (formID) => {
        var el = document.getElementById(formID)
            .getElementsByTagName("input"),
            d = {data:{}, set:{}};
            
        for (i = 0; i < el.length; i++) {
            switch (el[i].getAttribute("type")){
                //###########FALTAN OTROS CONTROLES##############                
                default:
                    d.data[el[i].getAttribute("id")] = null
                break;
            }
            if(el[i].classList.contains('notNull')){
                d.set[el[i].getAttribute("id")] = {notNull:true};
            }else{
                d.set[el[i].getAttribute("id")] = {notNull:false};
            }
        } 
        return d;
    },
    formSet:(formBody, data, id,idRel)=>{
        return new Promise(function (resolve, reject) {            
            if(id>0){
                Object.keys(data[0]).map(function(Key, index) {
                    //console.log('-'+Key);                    
                    var d = formBody.find((e)=>{
                        //console.log('--'+e.id);
                        return e.id == Key
                    });
                    if(d != undefined){
                        switch (d.type){                            
                            case "date":
                            case "time":
                            case "text":
                            case "textArea":
                            case "rep-text":
                                if(data[0][Key] == null){
                                    d.value = "--"
                                }else{d.value = data[0][Key]}                         
                            break;
                            case "rep-text-money":
                                if(data[0][Key] == null){
                                    d.value = "--"
                                }else{d.value = formatCurrency( data[0][Key],2)}                                 
                            break;
                            case "select":
                            case "rep-select":
                                d.selected = data[0][Key]
                            break;                            
                            case "vue-select":{ 
                                if(data[0][Key] != -1){
                                    var seleccionado= d.value.filter((e)=>{return e.code == data[0][Key]});
                                    d.selected = {"code":seleccionado[0].code,"label":seleccionado[0].label}
                                }else{
                                    d.selected = {"code":-1,"label":"Seleccione una opción"}
                                }
                            }
                            break;
                            case "vue-select-multiple":{
                                var list = data[0][Key];
                                list = JSON.parse("[" + list.substring(0, list.length - 1)+ "]");
                                d.selected = list;
                            }
                            break;
                            case "vue-select-ajax":{ 
                                var dat = {
                                    ID1:data[0][Key],
                                    ID2:d.CatTipoID,
                                    UsCuentaID: $.jCookies({ get: 'UsCuentaID' }),
                                    UsToken: $.jCookies({ get: 'UsToken' })
                                }
                                tools.axiosData("GenCatalogoGTByValID",dat,true).then(res=>{                                    
                                    if(res.length >0){
                                        d.value = [{"code":-1,"label":"Escriba y seleccione una opción"}]
                                        Object.keys(res).map(function(Key, index) {                                        
                                            d.value.push( 
                                                {"code":res[index].id,"label":res[index].text}
                                            );                                                                           
                                        });
                                    }else{
                                        d.value = [{"code":-1,"label":"Escriba y seleccione una opción"}]
                                    }
                                    var seleccionado= d.value.filter((e)=>{return e.code == data[0][Key]});
                                    d.selected = {"code":seleccionado[0].code,"label":seleccionado[0].label}
                                }); 
                            }
                            break;
                            case "vue-select-ajax-entidades":
                            
                            var dat = {
                                    "textoFiltro":data[0].DRCInstNombre,
                                    "tipologias":[
                                        {"id":8,"nombre":"Cooperante"}
                                    ]
                                }
                                tools.axiosData("https://entidades-geo-backend.uc.r.appspot.com/api/entidades/filtrar",dat,true,'ext').then(res=>{                                    
                                    if(res.length >0){
                                        d.value = [{"code":-1,"label":"Pendiente de encontrar cooperante"}]
                                        Object.keys(res).map(function(Key, index) {                                        
                                            d.value.push( 
                                                {"code":res[index].id,"label":res[index].nombre}
                                            );                                                                           
                                        });               
                                    }else{
                                        d.value = [{"code":-1,"label":"Pendiente de encontrar cooperante"}]
                                    }
                                    var seleccionado= d.value.filter((e)=>{return e.code == data[0][Key]});
                                    d.selected = {"code":seleccionado[0].code,"label":seleccionado[0].label}
                                }); 
                            break;
                            case "rep-vue-select-ajax":{ 
                                var dat = {
                                    ID1:data[0][Key],
                                    ID2:d.CatTipoID,
                                    UsCuentaID: $.jCookies({ get: 'UsCuentaID' }),
                                    UsToken: $.jCookies({ get: 'UsToken' })
                                }
                                tools.axiosData("GenCatalogoGTByValID",dat,true).then(res=>{ 
                                    var seleccionado= res.filter((e)=>{return e.id == data[0][Key]});
                                    d.value = seleccionado[0].text
                                }); 
                            }
                            break;
                        }
                    }
                });
            } else{
                Object.keys(formBody).map(function(Key, index) {
                    switch (formBody[index].type){
                        case "text":
                        case "textArea":
                        case "date":
                        case "time":
                            if(formBody[index].isId == true)
                                {formBody[index].value = -1;}
                            else if(idRel > 0 && formBody[index].dsc == "IdRel")//ID de relacion con tabla principal
                                {formBody[index].value = idRel;}
                            else
                                {formBody[index].value = "";}
                            
                        break;
                        case "select":                         
                            if (formBody[index].default != undefined){
                                formBody[index].selected = formBody[index].default;
                            }else{
                                formBody[index].selected = -1;
                                //elimina todas las selecciones anteriores
                                var seleccionado= formBody[index].value.filter((e)=>{return e.selected == true});
                                Object.keys(seleccionado).map(function(Key, index) { delete seleccionado[index].selected;}); 
                            }
                        break;
                        case "vue-select":
                        case "vue-select-ajax":                             
                            formBody[index].selected = {"code":-1,"label":"Seleccione una opción"};
                        break;
                        case "vue-select-ajax-entidades":                              
                            formBody[index].selected = {"code":-1,"label":"Pendiente de encontrar cooperante"};
                        break;
                        case "vue-select-multiple":                                                    
                            formBody[index].selected = [];
                        break;
                        case "vue-select-ajax-buscar":                              
                            formBody[index].filtro.selected = 1;
                        break;
                    }
                });
            }    
            resolve (formBody);
        });
    },
    
    formItemVal:(formItem)=>{
        formItem.validLbl.msg = "<strong>Errores:</strong> ";
        formItem.isValid = true;        
        Object.keys(formItem.valida).map(function(Key, index) {
            switch (formItem.valida[index]) {
                case "notNull":{                    
                    if(
                        formItem.value == "" && formItem.type == "text"
                        || formItem.value == "" && formItem.type == "textArea"
                        || formItem.value == "" && formItem.type == "date"
                        || formItem.value == "" && formItem.type == "time"                        
                    ){
                        formItem.isValid = false;
                        formItem.validLbl.msg = formItem.validLbl.msg 
                        + "Este campo es obligatorio, ";
                    }
                    if(formItem.selected != undefined){
                        if(                        
                            formItem.selected == -1 && formItem.type == "select"
                            || formItem.selected.code == -1 && formItem.type == "vue-select"
                            || formItem.selected.length == 0 && formItem.type == "vue-select-multiple"
                            || formItem.selected.code == -1 && formItem.type == "vue-select-ajax"
                        ){
                            formItem.isValid = false;
                            formItem.validLbl.msg = formItem.validLbl.msg 
                            + "Este campo es obligatorio, ";
                        }
                    }
                    
                    break;
                }
                case "isEmail":{
                    if(
                        tools.isEmail(formItem.value) == false && formItem.type == "text"
                    ){
                        formItem.isValid = false;
                        formItem.validLbl.msg = formItem.validLbl.msg 
                        + "Ingrese un Email valido, ";
                    }
                    break;
                }
                case "notNan":{
                    if(
                        isNaN(formItem.value) == true && formItem.type == "text"
                    ){
                        formItem.isValid = false;
                        formItem.validLbl.msg = formItem.validLbl.msg 
                        + "Ingrese un Numero, ";
                    }
                    break;
                }
                case "isDUI":{
                    if(
                        tools.isDUI(formItem.value) == false && formItem.type == "text"
                    ){
                        formItem.isValid = false;
                        formItem.validLbl.msg = formItem.validLbl.msg 
                        + "Ingrese un DUI valido (ej. 01387924-3), ";
                    }
                    break;
                } 
                case "isNIT":{
                    if(
                        tools.isNIT(formItem.value) == false && formItem.type == "text"
                    ){
                        formItem.isValid = false;
                        formItem.validLbl.msg = formItem.validLbl.msg 
                        + "Ingrese un NIT valido (ej. 0102-150654-106-8), ";
                    }
                    break;
                }
                case "isTel":{
                    if(
                        tools.isTel(formItem.value) == false && formItem.type == "text"
                    ){
                        formItem.isValid = false;
                        formItem.validLbl.msg = formItem.validLbl.msg 
                        + "Ingrese un Teléfono valido (ej. 7854 8521), ";
                    }
                    break;
                }                         
                default:
                break;
            }
        });

        
        return formItem.isValid;
    },
    formBodyVal:(formBody)=>{
        return new Promise(function (resolve, reject) {            
            var fbIsValid = true;
            var names = "";
            var msj = "";
            Object.keys(formBody).map(function(Key, index) {
                if(formBody[index].type != "label"){
                    if(tools.formItemVal(formBody[index]) == false){
                        fbIsValid = false;
                        names += "<br> - "+formBody[index].name;
                    }                    
                }                   
            });
            if(fbIsValid == false){
                msj =
                    "correct the following data:"
                    + "<small>"+ names +"</small>"
            }else{msj = "OK"}
            resolve(msj);            
        });
    },

    formGetData:(formBody)=>{
        var data = {};
        Object.keys(formBody).map(function(Key, index) {
            switch(formBody[index].type){
                case "text":
                case "textArea":
                    data[formBody[index].id] = formBody[index].value;
                break;
                case "date":
                    var DateTime = luxon.DateTime;
                    if(formBody[index].value == ''){
                        data[formBody[index].id] = DateTime.fromISO('1900-01-01').toFormat("yyyy-MM-dd"); 
                    }else{
                        data[formBody[index].id] = DateTime.fromISO(formBody[index].value).toFormat("yyyy-MM-dd"); 
                    }
                    
                break;
                case "time":
                    var DateTime = luxon.DateTime;
                    data[formBody[index].id] = DateTime.fromISO(formBody[index].value).toFormat("HH:mm"); 
                break;
                case "select":
                    data[formBody[index].id] = formBody[index].selected;
                break;
                case "vue-select": 
                case "vue-select-ajax": 
                case "vue-select-ajax-entidades": 
                    data[formBody[index].id] = formBody[index].selected.code;
                break;
                case "vue-select-multiple": 
                    var IDs = "";
                    Object.keys(formBody[index].selected).map(function(Key, index2) {
                        IDs += formBody[index].selected[index2].code +","              
                    });
                    data[formBody[index].id] = IDs;
                break;
                default:
                break;                 
            }                   
        });
        data["UpdUsuario"] = 1
        data["UsToken"] = "E¿A#C4W9$;VDL}&amp;2H7[!M:XI@B65)UF0P8G(TZ_¡=K{|]-/S°3N1RYOQ+J.*%,?";
        return data;
    },
    genLisCatDatos:(id1,id2,id3,formItem)=>{
        var data = {
            ID1:id1, 
            ID2:id2,
            ID3:id3,
            UsCuentaID: $.jCookies({ get: 'UsCuentaID' }),
            UsToken: $.jCookies({ get: 'UsToken' })
        }        
        tools.axiosData('CatalogoDatoByID',data).then(res=>{ 
            Object.keys(res).map(function(Key, index2) {
                formItem.value.push( 
                    {"id":res[index2].id,"val":res[index2].text}
                );
            }); 
        });
    },
    

   
    
    
    
    
    axiosData: (url,data,noBlock,t)=>{
        //if(noBlock == undefined || noBlock == false)blockUI($('body'));
        var urlSet = '';
        if(t == "ext"){urlSet = url;}else{urlSet = tools.urlRoot + url;}
        return axios({
            method: 'POST',
            url: urlSet,
            data: data
        })
        .then(function (res) {            
            //if(noBlock == undefined || noBlock == false)unblockUI($('body'));
            var r = res.data;
            if(t == "ext"){ 
                return r;
            }else{
                if(r.UsCuentaID === -1){
                    toastr["error"](r.UsMsj);  
                    setTimeout(()=>{window.location = "../login.html";}, 3000);                
                    return r.Reply;
                }else if(r.UsMsj != ""){
                    toastr["error"](
                        "<strong>Error al intentar actualizar datos:</strong> "
                        + r.UsMsj
                    );
                    return r.Reply;
                }
                else{                
                    return r.Reply;
                }     
            }
            
        })
        .catch(function (error) {
            //if(noBlock == undefined || noBlock == false)unblockUI($('body'));
            toastr["error"](error);
        })
    },
    loadCss:(name)=>{
        return new Promise(function (resolve, reject) {
            var l = cssLibraries.filter((e)=>{                                    
                return e.name == name
            });  
            
            if(l[0].loaded == false){
                var link = document.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = l[0].url;
                document.getElementsByTagName("head")[0].appendChild(link);
                l[0].loaded = true;
                resolve();
            }else{resolve();}
        });        
    },
    getDatLib: (data,conpNombre)=>{
        var res = data.find((e)=>{
            return e.Nombre == conpNombre
        });
        if((typeof res.Librerias)=="string"){
            res.Librerias = JSON.parse(res.Librerias);
        }
        return res;
    },
    genCompTemp: (id,render,tipo)=>{
        return new Promise(function (resolve, reject) {
            var side = document.getElementById(id);
            if( side == null){
                var div = document.createElement("div"),
                att = document.createAttribute("id");
                att.value = id;
                div.setAttributeNode(att);        
                if(tipo == "sub"){
                    side = document.getElementById("TempSub").appendChild(div);            
                }else{
                    side = document.getElementById("Temp").appendChild(div);
                }
                side.innerHTML = render;
            }
            resolve (side);
        });
    },
    genCompInstance:(divInstaceNombre, divInstaceId, divInstaceClonId)=>{
        return new Promise(function (resolve, reject) {    
            var divInstace = document.getElementById(divInstaceNombre);
            if(document.getElementById(divInstaceClonId) == null){
                var divInstace = document.getElementById(divInstaceNombre);
                var clon = document.getElementById(divInstaceId).firstChild.cloneNode(true)
                att = document.createAttribute("id");
                att.value = divInstaceClonId;                        
                clon.setAttributeNode(att);
                divInstace.appendChild(clon);
                require(['domReady!'], function (divInstace) {
                    resolve (divInstace);
                });                 
            }else{resolve (divInstace);}
        }); 
    },
    jsonCopy:(obj)=>{
        return JSON.parse(JSON.stringify(obj));
    },

    addToList:(List,Data,Method)=>{
        Object.keys(Data).map(function(Key, index) {
            switch (Method) {
                case "push":
                    List.push(Data[index])
                    break;
                case "unshift":
                    List.unshift(Data[index])
                    break;
                default:
                    break;
            }
        });
    },
    isJson:(str)=> {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    toUpByWord:(oracion)=>{
        oracion = oracion.toLowerCase();
        return oracion.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1){
           return $1.toUpperCase(); 
        });
    },
    cargaEditor:(holder)=>{
        return new Promise(function (resolve, reject) {
            tools.loadCss("editorjs");
            require([
                'plug/js/vendor/editorjs/assets/editor',
                'plug/js/vendor/editorjs/assets/tools/header',
                'plug/js/vendor/editorjs/assets/tools/list',
                'plug/js/vendor/editorjs/assets/tools/checklist',
                'plug/js/vendor/editorjs/assets/tools/table',
                'plug/js/vendor/editorjs/assets/tools/quote',
                'plug/js/vendor/editorjs/assets/tools/marker'
            ], function (EditorJS,Header,List,Checklist,Table,Quote,Marker) {             
                var varVue = new EditorJS({ 
                    holder : holder, 
                    autofocus: true,
                    tools: { 
                        header: {
                            class: Header, 
                            inlineToolbar: ['link'] 
                        }, 
                        list: { 
                            class: List, 
                            inlineToolbar: true,
                            shortcut: 'CMD+ALT+L' 
                        },
                        table: {
                            class: Table,
                            inlineToolbar: true,
                            shortcut: 'CMD+ALT+T'
                        }, 
                        checklist: {
                            class: Checklist,
                            inlineToolbar: false,
                            shortcut: 'CMD+ALT+C'
                        },
                        quote: {
                            class: Quote,
                            inlineToolbar: true,
                            config: {
                            quotePlaceholder: 'Ingrese Observación',
                            captionPlaceholder: 'Autor',
                            },
                            shortcut: 'CMD+ALT+O'
                        },
                        marker: {
                            class:  Marker,
                            shortcut: 'CMD+SHIFT+M'
                        }
                    }
                });            
                resolve (varVue);
            });
        });
    },
    printOptions:{
        name: '_blank',
        specs: [
            'fullscreen=yes',
            'titlebar=yes',
            'scrollbars=yes'
        ],
        styles: [
            '../plugins/js/vendor/fontawesome/css/all.min.css',
            '../css/bootstrap.min.css',
            '../css/mdb.css',
            '../css/style.css',            
            '../plugins/js/vendor/vue-datetime/vue-datetime.css',
            '../plugins/js/vendor/editorjs/assets/style.css',
            '../css/print.css',
        ]
    }
}



///CONFIG PLUGINS


