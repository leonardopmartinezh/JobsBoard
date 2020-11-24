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


        public Data01EL()
        {
            this.Pagination = -1;
            this.UsCuentaID = -1;
            this.UsToken = "";
        }
    }

    public class Data02EL
    {
        public Int32 ID { get; set; }
        public Int32 UsCuentaID { get; set; }
        public String UsToken { get; set; }


        public Data02EL()
        {
            this.ID = -1;
            this.UsCuentaID = -1;
            this.UsToken = "";
        }
    }
}
