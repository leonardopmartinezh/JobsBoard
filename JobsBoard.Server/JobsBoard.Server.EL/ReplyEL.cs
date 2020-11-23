using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobsBoard.Server.EL
{
    public class ReplyEL
    {
        public Object Reply { get; set; }

        public Int32 UsCuentaID { get; set; }
        public String UsToken { get; set; }
        public String UsMsj { get; set; }

        public ReplyEL()
        {
            this.Reply = new Object();
            this.UsCuentaID = -1;
            this.UsToken = "";
            this.UsMsj = "";
        }
    }

    public class Data01EL
    {
        public Int32 Pagination { get; set; }
        public Int32 UsCuentaID { get; set; }
        public String UsToken { get; set; }


        public ReplyEL()
        {
            this.Pagination = -1;
            this.UsCuentaID = -1;
            this.UsToken = "";
        }
    }
}
