using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobsBoard.Server.EL
{
    public class JobsEL
    {

        public Int32 JobID { get; set; }
        public String JobTitle { get; set; }
        public String JobDescription { get; set; }
        public String JobCreatedAt { get; set; }
        public String JobExpiresAt { get; set; }
        public Int32 UpdUsuario { get; set; }
        public String UsToken { get; set; }
        public JobsEL()
        {
            this.JobID = -1;
            this.JobTitle = "";
            this.JobDescription = "";
            this.JobCreatedAt = "";
            this.JobExpiresAt = "";
            this.UpdUsuario = -1;
            this.UsToken = "";
        }
    }

    
}
