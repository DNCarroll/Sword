using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sword.Api;


namespace Sword.Web.Api.Project
{
    public class ItemsController : DynamicController
    {

        internal override object DatabaseObject(DynamicSword obj, ActionType actionType)
        {
            return Universal.Objects;
        }

        internal override List<DynamicSword> AfterSelect(List<DynamicSword> objs)
        {
            return objs.OrderBy(o => o["ClassName"]).ToList();
        }

        internal override DynamicSword Before(ActionType action, DynamicSword obj)
        {
            switch (action)
            {
                case ActionType.Select:
                    break;
                case ActionType.Insert:
                    break;
                case ActionType.Update:
                    break;
                case ActionType.Delete:
                    Universal.Fields.Delete(obj);
                    break;
                case ActionType.Partial:
                    break;
                default:
                    break;
            }
            return obj;
        }

        internal override void ExceptionHandler(Exception ex)
        {
            throw new NotImplementedException();
        }
    }
}