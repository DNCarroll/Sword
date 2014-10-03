using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sword.Api;

namespace Sword.Web.Api.Project
{
    public class ConnectionStringsController : DynamicController
    {

        internal override object DatabaseObject(DynamicSword obj, ActionType actionType)
        {
            return Universal.ConnectionsStrings;
        }


        internal override List<DynamicSword> AfterSelect(List<DynamicSword> objs)
        {
            return objs.OrderBy(o => o["MachineName"]).ToList();
        }

        internal override void ExceptionHandler(Exception ex)
        {
            throw new NotImplementedException();
        }
    }
}