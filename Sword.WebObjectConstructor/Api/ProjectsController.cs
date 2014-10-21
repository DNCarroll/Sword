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
    public class ProjectsController : TypedController<Project>
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


        internal override object DatabaseObject(Project obj, ActionType actionType)
        {
            switch (actionType)
            {
                case ActionType.Select:
                    return "sword.Project_Get".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Insert:
                    return "sword.Project_Insert".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Update:
                    return "sword.Project_Update".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Delete:
                    return "sword.Project_Delete".GetCommand(Sword.Objects.ConnectionString.Value);
                case ActionType.Partial:                    
                default:
                    return null;
            }
        }
    }
}
