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
            UserBL us = new UserBL();
            String val = us.ValUserTokentBL(Data.UsCuentaID,Data.UsToken);
            if (val == "OK")
            {
                Re.Reply = cx.JobsList(Data.Pagination);
                Re.UsToken = Data.UsToken;
                Re.UsCuentaID = Data.UsCuentaID;
            }
            else
            {
                Re.UsToken = Data.UsToken;
                Re.UsCuentaID = Data.UsCuentaID;
                Re.UsMsj = val;
            }
            
            return Re;
        }

        public ReplyEL JobsListByIDBL(Data02EL Data)
        {
            ReplyEL Re = new ReplyEL();
            UserBL us = new UserBL();
            String val = us.ValUserTokentBL(Data.UsCuentaID, Data.UsToken);
            if (val == "OK")
            {
                Re.Reply = cx.JobsListByID(Data.ID);
                Re.UsToken = Data.UsToken;
                Re.UsCuentaID = Data.UsCuentaID;
            }
            else
            {
                Re.UsToken = Data.UsToken;
                Re.UsCuentaID = Data.UsCuentaID;
                Re.UsMsj = val;
            }            

            return Re;
        }

        public ReplyEL JobsGETBL(Data02EL Data)
        {
            ReplyEL Re = new ReplyEL();
            UserBL us = new UserBL();
            String val = us.ValUserTokentBL(Data.UsCuentaID, Data.UsToken);
            if (val == "OK")
            {
                Re.Reply = cx.JobsGET(Data.ID);
                Re.UsToken = Data.UsToken;
                Re.UsCuentaID = Data.UsCuentaID;
            }
            else
            {
                Re.UsToken = Data.UsToken;
                Re.UsCuentaID = Data.UsCuentaID;
                Re.UsMsj = val;
            }

            return Re;
        }

        //SV
        //**************************************
        public ReplyEL JobsSVBL(JobsEL Data)
        {
            ReplyEL Re = new ReplyEL();

            UserBL us = new UserBL();
            String val = us.ValUserTokentBL(Data.UpdUsuario, Data.UsToken);
            if (val == "OK")
            {
                JobsValBL valData = new JobsValBL();
                String valDataRes = valData.JobsValData(Data);
                if (valDataRes == "OK")
                {
                    JobsSV_Result SV = cx.JobsSV(
                        Data.JobID,
                        Data.JobTitle,
                        Data.JobDescription,
                        Data.JobCreatedAt,
                        Data.JobExpiresAt,

                        Data.UpdUsuario
                    ).SingleOrDefault();

                    if (SV.Msg == "OK")
                    {
                        Re.Reply = cx.JobsGET(SV.ID);
                    }
                    else
                    {
                        Re.Reply = "ERROR";
                        Re.UsMsj = SV.Msg;
                    }

                    Re.UsToken = Data.UsToken;
                    Re.UsCuentaID = Data.UpdUsuario;
                }
                else
                {
                    Re.UsMsj = valDataRes;
                    Re.UsToken = Data.UsToken;
                    Re.UsCuentaID = Data.UpdUsuario;
                }
            }
            else
            {
                Re.UsMsj = val;
                Re.UsCuentaID = -1;
<<<<<<< HEAD
            }

            return Re;
        }

        //DEL
        //**************************************
        public ReplyEL JobsDelBL(Data02EL Data)
        {
            ReplyEL Re = new ReplyEL();

            UserBL us = new UserBL();
            String val = us.ValUserTokentBL(Data.UsCuentaID, Data.UsToken);
            if (val == "OK")
            {
                JobsDel_Result SV = cx.JobsDel(
                    Data.ID,
                    false,

                    Data.UsCuentaID
                ).SingleOrDefault();

                if (SV.Msg == "OK")
                {
                    Re.Reply = cx.JobsGET(SV.ID);
                }
                else
                {
                    Re.Reply = "ERROR";
                    Re.UsMsj = SV.Msg;
                }

                Re.UsToken = Data.UsToken;
                Re.UsCuentaID = Data.UsCuentaID;
=======
>>>>>>> aadb797a297bcc9aa08a43a31591d53a4d40aa37
            }
        

            return Re;
        }
    }
}
