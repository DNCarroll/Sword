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
    public class ItemsController : TypedController<Item>
    {
        internal override void ExceptionHandler(Exception ex)
        {
            throw new NotImplementedException();
        }


        internal override object DatabaseObject(Item obj, ActionType actionType)
        {
            switch (actionType)
            {
                case ActionType.Select:
                    return "sword.Object_Get".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Insert:
                    return "sword.Object_Insert".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Update:
                    return "sword.Object_Update".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Delete:
                    return "sword.Object_Delete".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Partial:
                default:
                    return null;
            }
        }
    }
}
