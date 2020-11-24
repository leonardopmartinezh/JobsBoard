using System;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using System.Linq;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Helpers;
using System.Web.UI.WebControls;
using JobsBoard.Server.BL;
using JobsBoard.Server.EL;
using System.Web.Http.Cors;
using System.IO;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace JobsBoard.Server.WS.Controllers
{
    [RoutePrefix("api/ws")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class JobsController : ApiController
    {
        /*......List.....*/
        [ResponseType(typeof(ReplyEL))]
        [Route("JobsList")]
        [HttpPost]
        public IHttpActionResult JobsList(Data01EL Data)
        {
            JobsBL InstBL = new JobsBL();
            ReplyEL Res = InstBL.JobsListBL(Data);

            if (Res == null)
            {
                return NotFound();
            }

            return Ok(Res);
        }
        /*......ListByID.....*/
        [ResponseType(typeof(ReplyEL))]
        [Route("JobsListByID")]
        [HttpPost]
        public IHttpActionResult JobsListByID(Data02EL Data)
        {
            JobsBL InstBL = new JobsBL();
            ReplyEL Res = InstBL.JobsListByIDBL(Data);

            if (Res == null)
            {
                return NotFound();
            }

            return Ok(Res);
        }

        /*......JobsGET.....*/
        [ResponseType(typeof(ReplyEL))]
        [Route("JobsGET")]
        [HttpPost]
        public IHttpActionResult JobsGET(Data02EL Data)
        {
            JobsBL InstBL = new JobsBL();
            ReplyEL Res = InstBL.JobsGETBL(Data);

            if (Res == null)
            {
                return NotFound();
            }

            return Ok(Res);
        }

        /*......JobsGET.....*/
        [ResponseType(typeof(ReplyEL))]
        [Route("JobsSV")]
        [HttpPost]
        public IHttpActionResult JobsSV(JobsEL Data)
        {
            JobsBL InstBL = new JobsBL();
            ReplyEL Res = InstBL.JobsSVBL(Data);

            if (Res == null)
            {
                return NotFound();
            }

            return Ok(Res);
        }
    }
}