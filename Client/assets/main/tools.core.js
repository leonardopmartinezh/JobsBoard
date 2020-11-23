var tools = {
	urlServer:"http://app.conna.gob.sv/sinaes-server",
    urlRoot: 'http://app.conna.gob.sv/sinaes-server/api/ws/',
    //urlServer:"http://localhost:3835",
    //urlRoot: 'http://localhost:3835/api/ws/',
    formVAL: (d) => {
        var r = {res:true,msj:""};        
            
        for (var dato in d.data) {            
            if(d.set[dato].notNull === true){
                if(d.data[dato] === null){
                    var label = document.getElementById(dato).parentNode.getElementsByTagName('label')[0].innerHTML
                    r.res = false;                    
                    r.msj = r.msj + "Ingrese <strong>" + label + "</strong><br>"
                }
            }   
        } 
        return r;
    },
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
    cats: new Vuex.Store({
        state: {
            usData:{id:-1,name:''},
            listCat: [],
            isCat:{
                isCatData:false, isCatDataHechos:false,isCatCon:false,
                isCatDir:false,isCatDis:false,isCatInd:false,
                isCatPer:false,isCatPruebObs:false,isCatVul:false,
                isCatAdmin:false,isCatInr:false,isCatCondicion:false,
                isCatDilA:false,isCatDilR:false,isCatDilAc:false,

                isCatTRGen:false,isCatTRDet:false,isCatTRVehiculo:false,

                isCatDataProy:false
            },
            libs:{printLib:{}}

        },
        mutations: {}
    }),
    setCat:(isCatData, catList)=>{
        return new Promise(function (resolve, reject) {
            if(tools.cats.state.isCat[isCatData] == false){
                var data = {
                    "IDs": catList,
                    UsCuentaID: $.jCookies({ get: 'UsCuentaID' }),
                    UsToken: $.jCookies({ get: 'UsToken' })
                }
                tools.axiosData('GenCatalogoGTByIDs',data).then(res=>{
                    var grouped = {};
                    new Promise(function (resolve2, reject2) {
                        gr = res.groupBy('CatTipoNombre')                        
                        resolve2(gr)
                    }).then(g=>{
                        grouped = g;
                        Object.keys(grouped).map(function(Key, index) {
                            tools.cats.state.listCat[grouped[Key][0].CatTipoNombre] = [];                            
                            Object.keys(grouped[Key]).map(function(Key2, index2) {                                
                                tools.cats.state.listCat[grouped[Key][0].CatTipoNombre].push( 
                                    {"code":grouped[Key][index2].CatValID,"label":grouped[Key][index2].CatValNombre}
                                );                                
                            });  
                        });
                        tools.cats.state.isCat[isCatData] = true; 
                        resolve (tools.cats.state.isCat[isCatData]);   
                    });                    
                                       
                });
            } else{resolve (tools.cats.state.isCat[isCatData]);}        
        });
    },
    formSetCat: (formBody,isCatData, catList)=>{
        return new Promise(function (resolve, reject) {            
            tools.setCat(isCatData, catList).then(r=>{
                Object.keys(formBody).map(function(Key, index) {                   
                   if(tools.cats.state.listCat[formBody[index].id] != undefined){
                        switch (formBody[index].type){
                            case "select":{
                                formBody[index].value = []
                                formBody[index].value.push( 
                                    {
                                        "id":-1,
                                        "val":"Seleccione una opción"
                                    }
                                );
                                Object.keys(tools.cats.state.listCat[formBody[index].id]).map(function(Key, index2) {                                    
                                    formBody[index].value.push( 
                                        {
                                            "id":tools.cats.state.listCat[formBody[index].id][index2].code,
                                            "val":tools.cats.state.listCat[formBody[index].id][index2].label
                                        }
                                    );
                                });
                            }
                            break;
                            case "vue-select":
                            case "vue-select-ajax":
                            case "vue-select-ajax-entidades":
                            case "vue-select-multiple":  
                                formBody[index].value = tools.cats.state.listCat[formBody[index].id];
                            break; 
                            case "rep-select":
                                if(formBody[index].selected > 0){
                                    var selected = tools.cats.state.listCat[formBody[index].id].filter((e)=>{return e.code == formBody[index].selected});
                                    formBody[index].value = selected[0].label
                                }else{formBody[index].value = "---"}                            
                            break;                            
                        }
                    }
                });            
                resolve (formBody);
            });
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

        var label = document.getElementById(formItem.id).children[0];       
        if(formItem.isValid){
            label.classList.remove("blue-grey-text");
            label.classList.remove("red-text");
            label.classList.add("green-text");
            formItem.class = "border-success";
            formItem.validLbl.class = "";
            
        }else{
            label.classList.remove("green-text");
            label.classList.remove("blue-grey-text");
            label.classList.add("red-text");
            formItem.class = "border-danger";
            formItem.validLbl.class = "d-inline";
        }
        return formItem.isValid;
    },
    formBodyVal:(formBody)=>{
        return new Promise(function (resolve, reject) {            
            var fbIsValid = true;
            var names = "";
            Object.keys(formBody).map(function(Key, index) {
                if(formBody[index].type != "label"){
                    if(tools.formItemVal(formBody[index]) == false){
                        fbIsValid = false;
                        names += "<br> - "+formBody[index].name;
                    }                    
                }                   
            });
            if(fbIsValid == false){
                toastr["error"](
                    "<strong>Error en formulario:</strong> corrija las siguintes casillas marcadas con rojo:"
                    + "<small>"+ names +"</small>"
                    + " <br><small>El detalle del error se muestra bajo la casilla correspondiente.</small>"
                );
            }
            resolve(fbIsValid);            
        });
    },
    formReset: (formBody)=>{
        return new Promise(function (resolve, reject) {
            Object.keys(formBody).map(function(Key, index) {
                switch(formBody[index].type){
                    case "text":
                    case "textArea":
                    case "date":
                    case "time":
                    case "select":
                    case "vue-select":
                    case "vue-select-multiple":
                    case "vue-select-ajax":
                    case "vue-select-ajax-entidades":
                        formBody[index].class = ""
                        formBody[index].validLbl.class = "d-none";
                    break;
                    default:
                    break;
                }                              
            });
            resolve (formBody);
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
        data["UpdUsuario"] = $.jCookies({ get: 'UsCuentaID' });
        data["UsToken"] = $.jCookies({ get: 'UsToken' });
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
    isEmail: (email)=>{
        var res = false;
        if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(email)){
            res = true;
        }
        return res;
    },
    formBuscaCat:(formItem,buscar,loading)=>{   
        
        if(formItem.type == "vue-select-ajax"){
            var data = {
                CatTipoID: formItem.CatTipoID,
                Buscar:buscar,
                UsCuentaID: $.jCookies({ get: 'UsCuentaID' }),
                UsToken: $.jCookies({ get: 'UsToken' })
            }
            tools.axiosData("GenCatalogoGTByPalabra",data,true).then(res=>{
                loading(false);
                if(res.length >0){
                    formItem.value = [{"code":-1,"label":"Escriba y seleccione una opción"}]
                    Object.keys(res).map(function(Key, index) {                                        
                        formItem.value.push( 
                            {"code":res[index].id,"label":res[index].text}
                        );                                                                           
                    });
                }else{
                    formItem.value = [{"code":-1,"label":"Escriba y seleccione una opción"}]
                }
            });
        }else if(formItem.type == "vue-select-ajax-entidades"){
            var data = {
                "textoFiltro":buscar,
                "tipologias":[
                    {"id":8,"nombre":"Cooperante"}
                ]
            }
            tools.axiosData("https://entidades-geo-backend.uc.r.appspot.com/api/entidades/filtrar",data,true,'ext').then(res=>{                                    
                loading(false); 
                if(res.length >0){
                    formItem.value = [{"code":-1,"label":"Escriba y seleccione una opción"}]
                    Object.keys(res).map(function(Key, index) {                                        
                        formItem.value.push( 
                            {"code":res[index].id,"label":res[index].nombre}
                        );                                                                           
                    });                 
                }else{
                    formItem.value = [{"code":-1,"label":"Escriba y seleccione una opción"}]
                }
            }); 
        }else{
            if(formItem.filtro != undefined){
                var data = {
                    Tipo: formItem.filtro.selected,
                    Palabra:buscar,
                    UsCuentaID: $.jCookies({ get: 'UsCuentaID' }),
                    UsToken: $.jCookies({ get: 'UsToken' })
                }
                tools.axiosData("JPCasoBuscar",data,true).then(res=>{
                    loading(false);
                    if(res.length >0){
                        formItem.value = [{"code":-1,"label":"Escriba y seleccione una opción"}]
                        Object.keys(res).map(function(Key, index) {                                        
                            formItem.value.push( 
                                {"code":res[index].code,"label":res[index].label}
                            );                                                                           
                        });
                    }else{
                        formItem.value = [{"code":-1,"label":"Escriba y seleccione una opción"}]
                    }
                });
            }else{ loading(false);}
        }        
    },

    formRegDel:(data,listVue)=>{
        return new Promise(function (resolve, reject) {
            Swal.fire({
                title: 'Esta seguro?',
                text: "Se eliminarán los datos seleccionados",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ffbb33',
                cancelButtonColor: '#ff4444',
                confirmButtonText: 'Si, continuar!'
            }).then((result) => {
                if (result.value) { 
                    tools.axiosData("JPTablaRegACT",data).then(res=>{
                        if(res != "ERROR"){
                            Object.keys(listVue.listData).map(function(Key, index) {                                        
                                if(listVue.listData[index].itemID == data.JPTablaRegID){
                                    listVue.listData.splice(index, 1);
                                }                                                                          
                            });
                            //Mensaje de Copnfirmación
                            toastr["success"](
                                "<strong>Registro elimado correctamente</strong> "
                            );
                        } 
                        resolve (res);
                    });
                }
            });            
        });
    },




    isDUI:(DUI)=>{
        // var res = false;
        // if(/^[0-9]{8}[-][0-9]{1}$/i.test(DUI)){
        //     res = true;
        // }
        // return res;
        return tools.validaRegex(/^[0-9]{8}-[0-9]{1}$/,DUI);
    },
    isNIT:(NIT)=>{
        return tools.validaRegex(/^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}$/,NIT);
    },
    isTel:(Tel)=>{
        return tools.validaRegex(/^\+503 [2|6|7][0-9]{3} [0-9]{4}$/,Tel);
    },
    validaRegex:(regex, value)=>{
        if (regex.test(value)) {
            return true;
        } else {
            return false;
        }
    },



    setBodyRep:(res,bodyTemp,name,clonName,JPCasoID,printLib)=>{  
        return new Promise(function (resolve, reject) {
            if(res.length > 0){
                var body = [],datos=[];
                res.map( (resItem,index) => { 
                    body = tools.jsonCopy(bodyTemp);
                    body.map( (pr,pi) => { pr.colGrp = index +1});
                    tools.formSet(
                        body,
                        [resItem],
                        1
                    ).then(repBody =>{ 
                        datos = [].concat(datos,repBody);
                        if(res.length -1 == index){
                            datos.unshift(
                                {
                                    "id":"",
                                    "name":name,
                                    "dsc":"",
                                    "type":"label",
                                    "valid":[],
                                    "disabled":false,
                                    "value":"",
                                    "colNum":12,
                                    "colGrp":0
                                }                        
                            );
                            tools.cargaPrintMulti(
                                datos,
                                clonName + "_print" + name,
                                clonName + "_print"+name+"Clon",
                                JPCasoID,
                                printLib
                            );
                            resolve();
                        }
                    });
                });
            }else{resolve();}
        });
    },


    cargaPrintMulti:(repBody,contName,clonName,JPCasoID,printLib)=>{
        if(tools.cats.state.libs.printLib.Librerias == undefined){
            tools.cats.state.libs.printLib  = printLib;                
        }
        var dataConfig = { 
            dataComp:{                      
                contName: contName,
                clonName: clonName
            },
            dataReg: {                
                JPCasoID: JPCasoID,
                repBody: repBody
            },
            dataLibs: {
                printLib: tools.cats.state.libs.printLib      
            },
            funAlCargar: ()=>{},
            funAlCerrar:()=>{}
        };
        requirejs([
            tools.cats.state.libs.printLib.Librerias.core
        ],function(core){ 
            core.printINI(dataConfig)
        });

    },

    
    
    
    
    
    
    
    axiosData: (url,data,noBlock,t)=>{
        if(noBlock == undefined || noBlock == false)blockUI($('body'));
        var urlSet = '';
        if(t == "ext"){urlSet = url;}else{urlSet = tools.urlRoot + url;}
        return axios({
            method: 'POST',
            url: urlSet,
            data: data
        })
        .then(function (res) {            
            if(noBlock == undefined || noBlock == false)unblockUI($('body'));
            var r = res.data;
            if(t == "ext"){ 
                return r;
            }else{
                if(r.UsCuentaID === -1){
                    toastr["error"](r.UsMsj);  
                    setTimeout(()=>{window.location = "../login.html";}, 3000);                
                    return r.Respuesta;
                }else if(r.UsMsj != ""){
                    toastr["error"](
                        "<strong>Error al intentar actualizar datos:</strong> "
                        + r.UsMsj
                    );
                    return r.Respuesta;
                }
                else{                
                    return r.Respuesta;
                }     
            }
            
        })
        .catch(function (error) {
            if(noBlock == undefined || noBlock == false)unblockUI($('body'));
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

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "md-toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": 200,
    "hideDuration": 200,
    "timeOut": 2500,
    "extendedTimeOut": 1000,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

Array.prototype.groupBy = function(prop) {
    return this.reduce(function(groups, item) {
      const val = item[prop]
      groups[val] = groups[val] || []
      groups[val].push(item)
      return groups
    }, {})
}

let setDatePicker = {
    today: 'Hoy',
    clear: 'Limpiar',
    close: 'Cerrar',
    monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre', 'Deciembre'],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    labelMonthNext: 'Mes Siguiente',
    labelMonthPrev: 'Mes Anterior',
    labelMonthSelect: 'Seelcciones el mes',
    labelYearSelect: 'Seleccione el año',
    format: 'yyyy-mm-dd'    
};
let setTimePicker = {
    autoclose: true,
   'default': 'now',
    donetext : 'Aceptar'
};

let editorjsData = {
    "blocks" : [
        {
            "type" : "paragraph",
            "contentEditable": false,
            "data" : {
                "text" : "<b contenteditable=\"false\">Hechos</b>"
            }
        },
        {
            "type" : "list",
            "data" : {
                "style" : "ordered",
                "items" : []
            }
        },
        {
            "type" : "paragraph",
            "data" : {
                "text" : "<b contenteditable=\"false\">Lista de NNA presuntamente vulnerados</b>"
            }
        },
        {
            "type" : "list",
            "data" : {
                "style" : "ordered",
                "items" : []
            }
        },
        {
            "type" : "paragraph",
            "data" : {
                "text" : "<b contenteditable=\"false\">Lista de Presuntos Vulneradores</b>"
            }
        },
        {
            "type" : "list",
            "data" : {
                "style" : "ordered",
                "items" : []
            }
        },
        {
            "type" : "paragraph",
            "data" : {
                "text" : "<b contenteditable=\"false\">Tipo de Denunciante</b>"
            }
        },
        {
            "type" : "checklist",
            "data" : {
                "items" : [
                    {
                        "text" : "<span contenteditable=\"false\">Persona Natural</span>",
                        "checked" : false
                    },
                    {
                        "text" : "<span contenteditable=\"false\">Institución</span>",
                        "checked" : false
                    },
                    {
                        "text" : "<span contenteditable=\"false\">Anónimo</span>",
                        "checked" : false
                    }
                ]
            }
        },
        {
            "type" : "paragraph",
            "data" : {
                "text" : "<b contenteditable=\"false\">Datos del Denunciante&nbsp;</b>"
            }
        },
        {
            "type" : "paragraph",
            "data" : {
                "text" : "..."
            }
        },
        {
            "type" : "paragraph",
            "data" : {
                "text" : "<b contenteditable=\"false\">Tipo Caso</b>"
            }
        },
        {
            "type" : "checklist",
            "data" : {
                "items" : [
                    {
                        "text" : "<span contenteditable=\"false\">Denuncia</span>",
                        "checked" : false
                    },
                    {
                        "text" : "<span contenteditable=\"false\">Aviso</span>",
                        "checked" : false
                    },
                    {
                        "text" : "<span contenteditable=\"false\">Oficio</span>",
                        "checked" : false
                    },
                    {
                        "text" : "<span contenteditable=\"false\">Orientación</span>",
                        "checked" : false
                    }
                ]
            }
        },
        {
            "type" : "quote",
            "data" : {
                "text" : "",
                "caption" : "",
                "alignment" : "left"
            }
        }
    ]
}

let cssLibraries = [
    {
        name: "quill",
        url:"../plugins/js/vendor/quill/quill.snow.css",
        loaded: false
    },
    {
        name: "editorjs",
        url:"../plugins/js/vendor/editorjs/assets/style.css",
        loaded: false
    },
    {
        name: "select2",
        url:"../plugins/js/vendor/select2/select2.min.css",
        loaded: false
    },
    {
        name: "vue-select",
        url:"../plugins/js/vendor/vue-select/vue-select.css",
        loaded: false
    },
    {
        name: "vue-datetime",
        url:"../plugins/js/vendor/vue-datetime/vue-datetime.css",
        loaded: false
    },
    {
        name: "vue-upload",
        url:"../plugins/js/vendor/vue-upload/vue-upload-component.part.css",
        loaded: false
    },
    {
        name: "vue-calendar",
        url:"../plugins/js/vendor/vue-calendar/main.min.css",
        loaded: false
    }
]




//***********************************BEGIN Function calls *****************************	
function blockUI(el) {
    //disableScroll();
    $('button').attr({'disabled':true});
	$(el).block({
        message: '<div class=""><img src="../img/preloader/preloader-4.svg" width="100" alt=""></div>',
        css: {
            border: 'none',
            padding: '2px',
            backgroundColor: 'none',
            'z-index': 200001
        },
        overlayCSS: {
            backgroundColor: '#8B91A0',
            opacity: 0.5,
            cursor: 'wait',
            'z-index': 200000,
            position: 'fixed',
			height : '10000px'
        }
    });
}
// wrapper function to  un-block element(finish loading)
function unblockUI(el) {
    $(el).unblock();
	$('button').attr({'disabled':false});
    //enableScroll();
}

function formatCurrency (number,fractionDigits) {
    var formatted = new Intl.NumberFormat("en-US", {
      style: 'currency',
      currency: "USD",
      minimumFractionDigits: fractionDigits
    }).format(number);
    return formatted;
  }


function roundDec(numero, decimales) {
    numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
    if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
        return Number((Math.round(numero * 100) / 100).toFixed(decimales));
    } else {
        return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    }
}

function getUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  
    // we'll store the parameters here
    var obj = {};
  
    // if query string exists
    if (queryString) {
  
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
  
      // split our query string into its component parts
      var arr = queryString.split('&');
  
      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
  
        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
  
        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
  
        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {
  
          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];
  
          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string'){
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }
  
    return obj;
  }
