define([],function() {
    return {
        jobConfig
    }
});
let jobConfig = {
    "formJob":{
        "formBody":[
            {
                "id":"",
                "name":"Job Data",
                "dsc":"Enter the general data of the job",
                "type":"label",
                "valid":[],
                "disabled":false,
                "value":"",
                "colNum":12,
                "colGrp":1
            },
            //******************************** */
            {
                "id":"JobID",
                "name":"ID",
                "dsc":"id",
                "type":"text",
                "valida":["notNull","notNan"],
                "disabled":true,
                "display":"d-none",
                "value":"-1",
                "isId": true,
                "class":"",
                "isValid":false,
                "validLbl":{"class":"d-none","msg":""},
                "colNum":6,
                "colGrp":2
            },

            //******************************** */
            {
                "id":"JobTitle",
                "name":"Title",
                "dsc":"",
                "type":"text",
                "valida":["notNull"],
                "disabled":true,
                //"display":"d-none",
                "value":"",
                "isId": false,
                "class":"",
                "isValid":false,
                "validLbl":{"class":"d-none","msg":""},
                "colNum":6,
                "colGrp":2
            },            
            {
                "id":"JobDescription",
                "name":"Description",
                "dsc":"",
                "type":"textArea",
                "valida":["notNull"],
                "disabled":false,
                //"display":"d-none",
                "value":"",
                "isId": false,
                "class":"",
                "isValid":false,
                "validLbl":{"class":"d-none","msg":""},
                "colNum":12,
                "colGrp":2
            },
            //******************************** */
            {
                "id":"JobCreatedAt",
                "name":"Created At",
                "dsc":"",
                "type":"text",
                "valida":["notNull"],
                "disabled":false,
                "value":"",
                "isId": false,
                "class":"",
                "isValid":false,
                "validLbl":{"class":"d-none","msg":""},
                "colNum":6,
                "colGrp":3
            },
            {
                "id":"JobExpiresAt",
                "name":"Expires At",
                "dsc":"",
                "type":"text",
                "valida":["notNull"],
                "disabled":false,
                "value":"",
                "isId": false,
                "class":"",
                "isValid":false,
                "validLbl":{"class":"d-none","msg":""},
                "colNum":6,
                "colGrp":3
            },
            
        ],
        "formControls":[],
        "formInstaceNombre":"frm_job_conteiner",
        "formInstaceId":"N/A",
        "formInstaceClonId":"job_form"
    },
    
}