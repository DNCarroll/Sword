using Sword;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Sword.Api
{

    public enum ActionType
    {
        Select, Insert, Update, Delete, Partial
    };

    public abstract class TypedController<T> : ApiController
        where T : DynamicSword, new()
    {

        #region Properties

        internal abstract void ExceptionHandler(Exception ex);

        internal virtual bool InsertReturnsSelect()
        {
            return false;
        }

        private dynamic m_Parameter;
        internal dynamic Parameter
        {
            get { return m_Parameter; }
            set
            {
                m_Parameter = value;
            }
        }

        private ActionType m_ActionType;
        internal ActionType ActionType
        {
            get { return m_ActionType; }
            set { m_ActionType = value; }
        }

        #endregion

        internal virtual bool IsUpdateUser()
        {        
            return true;
        }

        internal virtual bool IsInsertUser()
        {
            return true;
        }

        internal virtual bool IsDeleteUser()
        {
            return true;
        }

        internal virtual bool IsSelectUser()
        {
            return true;
        }

        internal abstract object DatabaseObject(T obj, ActionType actionType);

        internal virtual List<T> AfterSelect(List<T> objs)
        {
            return objs;
        }

        internal virtual T After(ActionType action, T obj)
        {
            return obj;
        }

        internal virtual T Before(ActionType action, T obj)
        {
            return obj;
        }

        [HttpPatch]
        public virtual List<T> Select([FromBody]T obj)
        {
            this.ActionType = Api.ActionType.Select;
            Parameter = obj;
            List<T> ret = new List<T>();
            var databaseObject = DatabaseObject(obj, ActionType.Select);
            if (obj != null && databaseObject != null)
            {
                try
                {

                    if (this.IsSelectUser())
                    {
                        Before(ActionType.Select, obj);
                        if (databaseObject is DynamicTable)
                        {
                            var gs = (DynamicTable)databaseObject;
                            ret = gs.ToList<T>(obj);
                        }
                        else if (databaseObject is System.Data.SqlClient.SqlCommand)
                        {
                            var cmd = (System.Data.SqlClient.SqlCommand)databaseObject;
                            ret = cmd.ToList<T>(obj);
                        }
                    }
                }
                catch (Exception ex)
                {
                    ExceptionHandler(ex);
                }
                ret = AfterSelect(ret);
            }
            return ret;
        }

        [HttpPatch]

        T runAction(T obj, ActionType actionType)
        {
            Parameter = obj;
            this.ActionType = actionType;
            if (obj != null)
            {
                var databaseObject = DatabaseObject(obj, actionType);
                this.Before(actionType, obj);
                if (databaseObject is DynamicTable)
                {
                    var updateTable = (DynamicTable)databaseObject;
                    switch (actionType)
                    {
                        case ActionType.Insert:
                            updateTable.Insert(obj);
                            if (InsertReturnsSelect())
                            {
                                T parameter = new T();
                                foreach (var item in updateTable.PrimaryKeys())
                                {
                                    parameter[item] = obj[item];
                                }
                                obj = updateTable.FirstOrDefault<T>(parameter);
                            }
                            break;
                        case ActionType.Update:
                            updateTable.Update(obj);
                            break;
                        case ActionType.Delete:
                            updateTable.Delete(obj);
                            break;
                        case ActionType.Partial:
                        case ActionType.Select:
                        default:
                            break;
                    }

                    obj = After(actionType, obj);

                }
                else if (databaseObject is System.Data.SqlClient.SqlCommand)
                {
                    var cmd = (System.Data.SqlClient.SqlCommand)databaseObject;
                    if (cmd != null)
                    {
                        try
                        {
                            if (actionType != ActionType.Insert || !InsertReturnsSelect())
                            {
                                cmd.Execute(obj);
                                obj = After(actionType, obj);
                            }
                            else
                            {
                                obj = cmd.FirstOrDefault<T>(obj);
                            }
                        }
                        catch (Exception ex)
                        {
                            ExceptionHandler(ex);
                        }
                    }
                }
            }
            else
            {
                obj["SubscriptionEnded"] = true;
            }
            return obj;
        }

        public virtual T Put([FromBody]T obj)
        {
            if (IsUpdateUser())
            {
                return runAction(obj, ActionType.Update);
            }
            return obj;
        }

        public virtual T Post([FromBody]T obj)
        {
            if (IsInsertUser())
            {
                return runAction(obj, ActionType.Insert);
            }
            return obj;
        }

        public virtual bool Delete([FromBody]T obj)
        {
            var ret = true;
            try
            {
                if (IsDeleteUser())
                {
                    runAction(obj, ActionType.Delete);
                }
            }
            catch (Exception ex)
            {
                ExceptionHandler(ex);
                ret = false;
            }
            return ret;
        }

    }

    public abstract class DynamicController<T,S,D,I,U> : ApiController
        where T : DynamicSword, new()
        where S : DynamicSword, new()
        where D : DynamicSword, new()
        where I : DynamicSword, new()
        where U : DynamicSword, new()
    {

        #region Properties

        internal abstract void ExceptionHandler(Exception ex);

        internal virtual bool InsertReturnsSelect()
        {
            return false;
        }

        private dynamic m_Parameter;
        internal dynamic Parameter
        {
            get { return m_Parameter; }
            set
            {
                m_Parameter = value;
            }
        }

        private dynamic m_QueriedUser;
        internal virtual dynamic QueriedUser
        {
            get
            {
                return m_QueriedUser;
            }
            set { m_QueriedUser = value; }
        }

        private ActionType m_ActionType;
        internal ActionType ActionType
        {
            get { return m_ActionType; }
            set { m_ActionType = value; }
        }

        #endregion

        internal virtual bool IsUpdateUser()
        {
            return true;
        }

        internal virtual bool IsSelectUser()
        {
            return true;
        }

        internal abstract object DatabaseObject<V>(V obj, ActionType actionType)
            where V : DynamicSword, new();        

        internal virtual List<T> AfterSelect(List<T> objs)
        {
            return objs;
        }

        internal virtual V After<V>(ActionType action, V obj)
            where V : DynamicSword, new() 
        {
            return obj;
        }

        internal virtual V Before<V>(ActionType action, V obj)
            where V : DynamicSword, new() 
        {
            return obj;
        }

        [HttpPatch]
        public virtual List<T> Select([FromBody]S obj)
        {
            this.ActionType = Api.ActionType.Select;
            Parameter = obj;
            List<T> ret = new List<T>();
            var databaseObject = DatabaseObject(obj, ActionType.Select);
            if (obj != null && databaseObject != null)
            {
                try
                {

                    if (this.QueriedUser != null)
                    {
                        Before(ActionType.Select, obj);
                        if (databaseObject is DynamicTable)
                        {
                            var gs = (DynamicTable)databaseObject;
                            ret = gs.ToList<T>(obj);
                        }
                        else if (databaseObject is System.Data.SqlClient.SqlCommand)
                        {
                            var cmd = (System.Data.SqlClient.SqlCommand)databaseObject;
                            ret = cmd.ToList<T>(obj);
                        }
                    }
                }
                catch (Exception ex)
                {
                    ExceptionHandler(ex);
                }
                ret = AfterSelect(ret);
            }
            return ret;
        }

        V runAction<V>(V obj, ActionType actionType)
            where V : DynamicSword, new() 
        {            
            Parameter = obj;
            this.ActionType = actionType;
            if (obj != null)
            {
                var databaseObject = DatabaseObject(obj, actionType);
                if (IsUpdateUser())
                {

                    this.Before(actionType, obj);
                    if (databaseObject is DynamicTable)
                    {
                        var updateTable = (DynamicTable)databaseObject;
                        switch (actionType)
                        {
                            case ActionType.Insert:
                                updateTable.Insert(obj);
                                if (InsertReturnsSelect())
                                {
                                    T parameter = new T();
                                    foreach (var item in updateTable.PrimaryKeys())
                                    {
                                        parameter[item] = obj[item];
                                    }
                                    obj = updateTable.FirstOrDefault<V>(parameter);
                                }
                                break;
                            case ActionType.Update:
                                updateTable.Update(obj);
                                break;
                            case ActionType.Delete:
                                updateTable.Delete(obj);
                                break;
                            case ActionType.Partial:
                            case ActionType.Select:
                            default:
                                break;
                        }

                        obj = After(actionType, obj);

                    }
                    else if (databaseObject is System.Data.SqlClient.SqlCommand)
                    {
                        var cmd = (System.Data.SqlClient.SqlCommand)databaseObject;
                        if (cmd != null)
                        {
                            try
                            {
                                if (actionType != ActionType.Insert || !InsertReturnsSelect())
                                {
                                    cmd.Execute(obj);
                                    obj = After(actionType, obj);
                                }
                                else
                                {
                                    obj = cmd.FirstOrDefault<V>(obj);
                                }
                            }
                            catch (Exception ex)
                            {
                                ExceptionHandler(ex);
                            }
                        }
                    }
                }
                else
                {
                    obj["SubscriptionEnded"] = true;
                }
            }
            return obj;
        }

        public virtual U Put([FromBody]U obj)
        {
            return runAction(obj, ActionType.Update);
        }

        public virtual I Post([FromBody]I obj)
        {
            return runAction(obj, ActionType.Insert);
        }

        public virtual bool Delete([FromBody]D obj)
        {
            var ret = true;
            try
            {
                runAction(obj, ActionType.Delete);
            }
            catch (Exception ex)
            {
                ExceptionHandler(ex);
                ret = false;
            }
            return ret;
        }

    }

    public abstract class DynamicController : TypedController<DynamicSword>
    {
        internal abstract override void ExceptionHandler(Exception ex);

        internal abstract override object DatabaseObject(DynamicSword obj, ActionType actionType);
    }

    public abstract class DynamicController<T> : DynamicController<T, DynamicSword, DynamicSword, DynamicSword, DynamicSword>
        where T : DynamicSword, new()
    {
        internal abstract override object DatabaseObject<V>(V obj, ActionType actionType);

        internal abstract override void ExceptionHandler(Exception ex);
    }
}