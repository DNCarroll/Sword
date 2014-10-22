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
    public class EnumsController : TypedController<EnumObject>
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


        internal override object DatabaseObject(EnumObject obj, ActionType actionType)
        {
            switch (actionType)
            {
                case ActionType.Select:
                    return "sword.Enum_Get".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Insert:
                    return "sword.Enum_Insert".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Update:
                    return "sword.Enum_Update".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Delete:
                    return "sword.Enum_Delete".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Partial:
                default:
                    return null;
            }
        }
    }
}
