requirejs.config({
    baseUrl: 'components',
    paths: {
        main: '../assets/main',
        text: '../assets/main/text',
        domReady: '../assets/maindomReady'
    },
    waitSeconds : 10000000000000
});

requirejs([
    'jobs/jobs.config',
    'text',
],
function   (config,text) {   
    requirejs([
        'text!jobs/jobs.render.html!strip'
    ],
    function   (render) { 
        document.getElementById("content").innerHTML = render;
        job.config =config;
        job.setForm();      
        job.loadList();      
    });
});

 let job={//----CAMBIAR AL COPIAR
    config:{},
    //Listas vue
    formVue:{},listVue:{}, etapaListVue:{},

    Pag:1, 
    editor:null,
    id:-1,
    //Librerias Sub Componetes
    listLib:{},formLib:{},tabsLib:{},pruebObsLib:{},adjLib:{},proyPrintRepLib:{},
    
    setForm:(config)=>{
        job.formVue = new Vue({
            el: "#job_form",//----CAMBIAR AL COPIAR
            data:{ 
                id: job.id,                    
                formBody: job.config.jobConfig.formJob.formBody,          
            },
            methods: {
                newFunc(){job.clearForm(); },
                saveFunc(){job.saveForm();}
            }, 
            mounted() {
                $('#JobCreatedAt').datepicker({
                    showOtherMonths: true,
                    format: 'yyyy-mm-dd'
                });
                $('#JobExpiresAt').datepicker({
                    showOtherMonths: true,
                    format: 'yyyy-mm-dd'
                });
                
            },               
        });
    },
    
    loadList: ()=>{
        data= {
            "Pagination": 1,
            "UsCuentaID": 1,
            "UsToken": "E¿A#C4W9$;VDL}&amp;2H7[!M:XI@B65)UF0P8G(TZ_¡=K{|]-/S°3N1RYOQ+J.*%,?"
        }
        tools.axiosData('JobsList',data).then(res=>{
            job.listVue = new Vue({
                el: "#job_list",//----CAMBIAR AL COPIAR
                data:{                    
                    listData: res,          
                },
                methods: {
                    editFunc(id){                            
                        job.id = id; 
                        job.loadForm(id);                      
                    },
                    elimFunc(id){
                        job.delList(id);
                    },
                }, 
                mounted() {

                },               
            });
           
        });      
    },

    loadForm:(id)=>{
        data= {
            "ID": id,
            "UsCuentaID": 1,
            "UsToken": "E¿A#C4W9$;VDL}&amp;2H7[!M:XI@B65)UF0P8G(TZ_¡=K{|]-/S°3N1RYOQ+J.*%,?"
        }
        tools.axiosData('JobsGET',data).then(res=>{
            //carga datos en form
            tools.formSet(job.config.jobConfig.formJob.formBody,res,id).then(r =>{});   
        });
    },

    saveForm:()=>{
        job.config.jobConfig.formJob.formBody[4].value = document.getElementById('JobCreatedAt').value;
        job.config.jobConfig.formJob.formBody[5].value = document.getElementById('JobExpiresAt').value;
        tools.formBodyVal(job.config.jobConfig.formJob.formBody).then(msj=>{
            if(msj == "OK"){
                Swal.fire({
                    title: 'Are you sure?',
                    text: "The data will be saved according to the form",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#33b5e5',
                    cancelButtonColor: '#ff4444',
                    confirmButtonText: 'Yes continue!'
                }).then((result) => {
                    if (result.value) {                
                        var data = tools.formGetData(job.config.jobConfig.formJob.formBody);
                        tools.axiosData("JobsSV",data).then(res=>{                                       
                            if(res != "ERROR"){
                                var r = res[0]; 
                                job.config.jobConfig.formJob.formBody[1].value = r.JobID;     
                                //Actualiza Lista
                                var inn = false;
                                Object.keys(job.listVue.listData).map(function(Key, index) {
                                    if(job.listVue.listData[index].JobID == r.JobID){
                                        console.log("entra");
                                        job.listVue.listData[index].JobTitle =r.JobTitle;
                                        job.listVue.listData[index].JobCreatedAt = r.JobCreatedAt;
                                        inn = true
                                    }                      
                                });  
                                if(inn == false)    {
                                    job.listVue.listData.unshift(r); 
                                }                        
                                
                            }                  
                        });             
                    }
                });
            }else{
                Swal.fire({
                    title: 'Error',
                    html: msj,
                    type: 'error',
                    confirmButtonColor: '#33b5e5',
                    confirmButtonText: 'OK'
                })
            }
        });
    },

    delList:(id)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "The data will be deleted",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#33b5e5',
            cancelButtonColor: '#ff4444',
            confirmButtonText: 'Yes continue!'
        }).then((result) => {
            if (result.value) { 
                data= {
                    "ID": id,
                    "UsCuentaID": 1,
                    "UsToken": "E¿A#C4W9$;VDL}&amp;2H7[!M:XI@B65)UF0P8G(TZ_¡=K{|]-/S°3N1RYOQ+J.*%,?"
                }
                tools.axiosData('JobsDel',data).then(res=>{
                    if(res != "ERROR"){
                        job.clearForm(); 
                        Object.keys(job.listVue.listData).map(function(Key, index) {                                        
                            if(job.listVue.listData[index].JobID == id){
                                job.listVue.listData.splice(index, 1);
                            }                                                                          
                        });                      
                    }    
                
                }); 
            }
        }); 
    },

    clearForm:()=>{
        var body = job.config.jobConfig.formJob.formBody;
        Object.keys(body).map(function(Key, index) {                                        
            body[index].value = '';                                                                        
        }); 
        body[1].value = '-1';
    }

 };