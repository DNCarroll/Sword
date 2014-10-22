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
    public class ConnectionsController : TypedController<Connection>
    {

        internal override dynamic QueriedUser
        {
            get
            {
                return new { };
            }
            set
            {
                base.QueriedUser = value;
            }
        }
        internal override void ExceptionHandler(Exception ex)
        {
            throw new NotImplementedException();
        }


        internal override object DatabaseObject(Connection obj, ActionType actionType)
        {
            switch (actionType)
            {
                case ActionType.Select:
                    return "sword.Connection_Get".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Insert:
                    return "sword.Connection_Insert".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Update:
                    return "sword.Connection_Update".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Delete:
                    return "sword.Connection_Delete".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Partial:
                default:
                    return null;
            }
        }
    }
}
