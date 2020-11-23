

requirejs([
    '../../components/jobs/jobs.config',
],
function   (config,render) {   
    var libComp =
        {
            "config": config,
            "render": '../../components/jobs/jobs.render.html',
        }
    job.INI(libComp);
});

 let job={//----CAMBIAR AL COPIAR
    LibComp:{},LibSubComp:{},
    //Listas vue
    listVue:{}, etapaListVue:{},

    Pag:1, 
    editor:null,
    id:-1,
    //Librerias Sub Componetes
    listLib:{},formLib:{},tabsLib:{},pruebObsLib:{},adjLib:{},proyPrintRepLib:{},
    

    INI: (libComp)=>{
        
        job.editor = null; //reset EdotorJS
        job.LibComp = libComp;//Set Librerias del componente principal en variable global
        data= {
            UsCuentaID: 1,
            UsToken: '9=4TRD_6&amp;8(-P3E:1BV;7U°JLHI)FKCG*}{|@#XA¿[5Q!,$N2Z0S¡?M%]W/OY+'
        }
        tools.axiosData('jobsList',data).then(res=>{
            job.LibSubComp = res; //Set Librerias de SubComponentes en variable global
            job.listLib = tools.getDatLib(job.LibSubComp,"List");         
            if(document.getElementById("list") == null){
                requirejs([
                    "text!"+job.listLib.Librerias.render+"!strip"
                ],function(render){
                    tools.genCompTemp(job.listLib.Librerias.rute,render,"sub").then(div=>{
                        job.cargarList(job.listLib);
                    });               
                }); 
            }else{ job.cargarList(job.listLib); }
        });      
    },
 };