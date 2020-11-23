using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobsBoard.Server.DL;
using JobsBoard.Server.EL;

namespace JobsBoard.Server.BL
{
    public class JobsBL
    {
        JobBoardEntities cx = new JobBoardEntities();

        public ReplyEL JobsListBL(Data01EL Data)
        {
            ReplyEL Re = new ReplyEL();
            JobsList_Result val = cx.JobsList(Pagination);
            if (val.RES == "OK")
            {
                Re.Reply = cx.JobsList(Data.Pagination);
                Re.UsToken = Data.UsToken;
                Re.UsCuentaID = Data.UsCuentaID;
            }
            else
            {
                Res.UsMsj = val.RES;
                Res.UsCuentaID = -1;
            }

            return Res;
            return Re;
        }
    }
}
