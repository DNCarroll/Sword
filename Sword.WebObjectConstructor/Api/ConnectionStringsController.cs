using Sword.Api;
using Sword.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sword.WebObjectConstructor.Api
{
    public class ConnectionStringsController : TypedController<ConnectionStringObject>
    {
        internal override void ExceptionHandler(Exception ex)
        {
            throw new NotImplementedException();
        }


        internal override object DatabaseObject(ConnectionStringObject obj, ActionType actionType)
        {
            switch (actionType)
            {
                case ActionType.Select:
                    return "sword.ConnectionString_Get".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Insert:
                    return "sword.ConnectionString_Insert".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Update:
                    return "sword.ConnectionString_Update".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Delete:
                    return "sword.ConnectionString_Delete".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Partial:
                default:
                    return null;
            }
        }
    }
}
