using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobsBoard.Server.DL;
using JobsBoard.Server.EL;

namespace JobsBoard.Server.BL
{
    public class UserBL
    {
        JobBoardEntities cx = new JobBoardEntities();

        public String ValUserTokentBL(Int32 UsCuentaID, String UsToken)
        {
            //the validation code goes here

            return "OK";
        }

    }
}
