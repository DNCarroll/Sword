using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sword.Api;

namespace Sword.Web.Api.Project
{
    public class FieldsController : DynamicController
    {

        internal override object DatabaseObject(DynamicSword obj, ActionType actionType)
        {
            return Universal.Fields;
        }

        internal override List<DynamicSword> AfterSelect(List<DynamicSword> objs)
        {
            //need to check for new fields
            var obj = Universal.Objects.FirstOrDefault(new {ObjectID=this.Parameter.ObjectID});
            var conn = Universal.Connections.FirstOrDefault(new {ConnectionID= obj["ConnectionID"]});
            var existing = (new DynamicTable(obj["TableName"].ToString(), conn["ConnectionString"].ToString())).FieldDefinitions();
            foreach (dynamic item in existing)
            {
                var found = objs.FirstOrDefault(o => o["TableName"].ToString() == item.TableName.ToString());
                if (found == null)
                {
                    dynamic newField = new DynamicSword();
                    newField.TableName = item.TableName;
                    newField.PropertyName = item.TableName;
                    newField.SqlDbType = item.SqlDbType;
                    newField.ObjectID = this.Parameter.ObjectID;                    
                    newField.Include = true;
                    newField.JsonSerializable = true;
                    newField.XmlSerializable = true;
                    newField.UDT = "";
	                newField.GetMethod = "";
	                newField.SetMethod = "";
	                newField.IsReadOnly = false;
	                newField.Aliases = "";	
	                newField.UseChangeEvent = false;
	                newField.DefaultValue = "";
	                newField.IsEnum = false;
	                newField.IncludeInSetValue  = true;
                    Universal.Fields.Insert(newField);
                    objs.Add((DynamicSword)newField);
                }
            }

            return objs.OrderBy(o => o["PropertyName"]).ToList();
        }

        internal override void ExceptionHandler(Exception ex)
        {
            throw new NotImplementedException();
        }
    }
}