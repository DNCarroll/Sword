using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace Sword.Web.CodeConstructor
{
    public static class Common
    {
        public static string NetType(SqlDbType type)
        {
            switch (type)
            {
                case SqlDbType.BigInt:
                    return "long";
                case SqlDbType.Image:
                case SqlDbType.Binary:
                case SqlDbType.VarBinary:
                    return "byte[]";
                case SqlDbType.Bit:
                    return "bool";
                case SqlDbType.Char:
                case SqlDbType.NChar:
                    return "char";
                case SqlDbType.VarChar:
                case SqlDbType.NVarChar:
                case SqlDbType.NText:
                case SqlDbType.Text:
                case SqlDbType.Xml:
                    return "string";
                case SqlDbType.SmallDateTime:
                case SqlDbType.DateTime:
                case SqlDbType.DateTime2:
                case SqlDbType.DateTimeOffset:
                case SqlDbType.Date:
                    return "DateTime";
                case SqlDbType.Money:
                case SqlDbType.SmallMoney:
                case SqlDbType.Decimal:
                    return "decimal";
                case SqlDbType.Float:
                    return "double";
                case SqlDbType.Int:
                    return "int";
                case SqlDbType.Real:
                    return "Single";
                case SqlDbType.SmallInt:
                    return "short";
                case SqlDbType.TinyInt:
                    return "byte";
                case SqlDbType.UniqueIdentifier:
                    return "Guid";
                case SqlDbType.Time:                    
                    return "TimeSpan";
                case SqlDbType.Structured:                
                case SqlDbType.Timestamp:
                case SqlDbType.Udt:
                case SqlDbType.Variant:
                default:
                    return "unknown";
            }
        }

        public static string Tabs(int count)
        {
            string tab = "";
            int i = 0;
            while (i < count)
            {
                tab += "\t";
                i++;
            }
            return tab;
        }

        public static bool IsStringNull(dynamic obj)
        {
            if (obj != null)
            {
                if (obj is string)
                {
                    return string.IsNullOrEmpty((string)obj);
                }
            }
            return true;
        }
    }

    public static class Projects
    {
        public static void SetUsings(System.Text.StringBuilder sb, List<DynamicSword> objs)
        {
            sb.AppendLine("using System;");
            sb.AppendLine("using Sword;");
            sb.AppendLine("using System.Linq;");
            sb.AppendLine("using System.Collections.Generic;");
            sb.AppendLine("using System.Data.SqlClient;");
            sb.AppendLine("using Newtonsoft.Json;");

            if (objs.FirstOrDefault(o => (bool)o["UseChangeEvent"]) != null)
            {
                sb.AppendLine("using System.ComponentModel;");
            }
        }

        
    }

    public static class Objects
    {

        public static string TypeScript(dynamic obj)
        {
            string className = (string)obj.ClassName;
            var sb = new System.Text.StringBuilder();
            int tabs = 0;
            sb.AppendWithTabs("class " + className + "{", tabs);
            var fields = Universal.Fields.ToList(new { ObjectID = obj.ObjectID });
            foreach (dynamic f in fields)
            {
                string propertyName = (string)f.PropertyName;
                SqlDbType sqlDbType = (SqlDbType)f.SqlDbType;
                var type = "any";
                if (f.IsEnum)
                {
                    type = f.UDT;
                }
                else if (!Common.IsStringNull(f.DefaultValue) && f.DefaultValue.ToString().IndexOf("List<") > -1)
                {
                    type = "Array<any>";
                }
                else
                {
                    switch (sqlDbType)
                    {
                        case SqlDbType.Money:
                        case SqlDbType.Int:
                        case SqlDbType.Float:
                        case SqlDbType.Decimal:
                        case SqlDbType.BigInt:
                        case SqlDbType.SmallInt:
                        case SqlDbType.SmallMoney:
                        case SqlDbType.TinyInt:
                        case SqlDbType.Real:
                            type = "number";
                            break;
                        case SqlDbType.Bit:
                            type = "boolean";
                            break;
                        case SqlDbType.DateTimeOffset:
                        case SqlDbType.DateTime2:
                        case SqlDbType.DateTime:
                        case SqlDbType.Date:
                        case SqlDbType.SmallDateTime:
                            type = "Date";
                            break;
                        case SqlDbType.Char:
                        case SqlDbType.NChar:
                        case SqlDbType.NText:
                        case SqlDbType.NVarChar:
                        case SqlDbType.Text:
                        case SqlDbType.VarChar:
                        case SqlDbType.Xml:
                            type = "string";
                            break;
                        default:
                            break;
                    }
                }
                sb.AppendWithTabs(propertyName + ":" + type + ";", tabs + 2);
            }
            sb.AppendWithTabs("constructor (obj?:any) {", tabs + 1);
            foreach (dynamic f in fields)
            {
                SqlDbType sqlDbType = (SqlDbType)f.SqlDbType;
                string propertyName = (string)f.PropertyName;
                if (!Common.IsStringNull(f.DefaultValue))
                {
                    string defaultValue = (string)f.DefaultValue;
                    sb.AppendWithTabs("this." + propertyName + " = " + defaultValue + ";", tabs + 2);
                }
                else if (f.IsEnum)
                {
                    sb.AppendWithTabs("this." + propertyName + " = 0;", tabs + 2);
                }
                else if (!Common.IsStringNull(f.DefaultValue) && f.DefaultValue.IndexOf("List<") > -1)
                {
                    sb.AppendWithTabs("this." + propertyName + " = new Array<any>();", tabs + 2);
                }
                else
                {
                    switch (sqlDbType)
                    {
                        case SqlDbType.Money:
                        case SqlDbType.Int:
                        case SqlDbType.Float:
                        case SqlDbType.Decimal:
                        case SqlDbType.BigInt:
                        case SqlDbType.SmallInt:
                        case SqlDbType.SmallMoney:
                        case SqlDbType.TinyInt:
                        case SqlDbType.Real:
                            sb.AppendWithTabs("this." + propertyName + " = 0;", tabs + 2);
                            break;
                        case SqlDbType.Bit:
                            sb.AppendWithTabs("this." + propertyName + " = false;", tabs + 2);
                            break;
                        case SqlDbType.DateTimeOffset:
                        case SqlDbType.DateTime2:
                        case SqlDbType.DateTime:
                        case SqlDbType.Date:
                        case SqlDbType.SmallDateTime:
                            sb.AppendWithTabs("this." + propertyName + " = new Date();", tabs + 2);
                            break;
                        case SqlDbType.Char:
                        case SqlDbType.NChar:
                        case SqlDbType.NText:
                        case SqlDbType.NVarChar:
                        case SqlDbType.Text:
                        case SqlDbType.VarChar:
                        case SqlDbType.Xml:
                            sb.AppendWithTabs("this." + propertyName + " = null;", tabs + 2);
                            break;
                        default:
                            break;
                    }
                }
            }
            sb.AppendWithTabs("Thing.Merge(obj, this);", tabs + 2);
            sb.AppendWithTabs("}", tabs + 1);
            sb.AppendWithTabs("}", tabs);
            return sb.ToString();
        }

        public static void Set(StringBuilder sb, dynamic obj)
        {
            var tabs = 1;
            //if (!Common.IsStringNull(obj.Namespace))
            //{
            //    sb.AppendLine("namespace " + obj.Namespace);
            //    sb.AppendLine("{");
            //}
            string className = (string)obj.ClassName;
            sb.AppendWithTabs("[JsonConverter(typeof(SwordAbstractSerializer<" + className + ">))]", tabs);            
            sb.AppendWithTabs("public partial class " + className + ": " + (obj.UseObjectState ? " SwordObject" : " DynamicSword") + (!obj.UseObjectState && obj.UseChangeEvent ? ", ISwordState" : ""), tabs);
            var fields = Universal.Fields.ToList(new { ObjectID = obj.ObjectID });
            sb.AppendWithTabs("{", tabs);
            //if (!Common.IsStringNull(obj.UserCode))
            //{
            //    sb.AppendWithTabs("#region User Code", tabs, true);
            //    sb.AppendLine(obj.UserCode);
            //    sb.AppendWithTabs("#endregion", tabs, true);
            //}

            sb.AppendWithTabs("#region Sword Code", tabs + 1, true);
            sb.AppendWithTabs("#region Properties", tabs + 1, true);

            foreach (var item in fields)
            {
                Fields.AddProperty(sb, item, tabs + 1);
            }
            sb.AppendWithTabs("#endregion", tabs + 1, true);
            Fields.SetISword(sb, tabs, fields, obj);
            Objects.SetISwordState(sb, tabs, obj);
            sb.AppendWithTabs("#endregion", tabs + 1, true);

            //put the Procedures in here can use query for it
            Objects.SetProcedures(sb, tabs, obj);

            sb.AppendWithTabs("}", tabs);
            //if (!Common.IsStringNull(obj.Namespace))
            //{
            //    sb.AppendLine("}");
            //}
            //return sb.ToString();
        }

        public static void SetISwordState(System.Text.StringBuilder sb, int tabs, dynamic obj)
        {

            if (obj.UseChangeEvent && !obj.UseObjectState)
            {
                var SwordState =
@"#region ISwordState
private SwordState m_ObjectState = SwordState.New;


public SwordState ObjectState
{
    get { return m_ObjectState; }
    set
    {
        if (obj.ObjectState != SwordState.Loading)
        {
            if (m_ObjectState != SwordState.New)
            {
                m_ObjectState = value;
            }
            onNotifyChanged();                    
        }
    }
}
void onNotifyChanged()
{
    if (obj.PropertyChanged != null)
    {
        obj.PropertyChanged(this, new PropertyChangedEventArgs(ChangingProperty));
    }
}
public void AcceptChanges()
{
    m_ObjectState = SwordState.Current;
}
private string m_ChangingProperty;


public string ChangingProperty
{
    get { return m_ChangingProperty; }
    set { m_ChangingProperty = value; }
}
public event PropertyChangedEventHandler PropertyChanged;
#endregion";
                var splits = SwordState.Split(new string[] { "\r\n" }, System.StringSplitOptions.None);
                foreach (var line in splits)
                {
                    sb.AppendWithTabs(line, tabs + 1);
                }
                sb.AppendLine();
            }
        }

        public static void SetProcedures(System.Text.StringBuilder sb, int tabs, dynamic obj)
        {
            var procedures = Universal.Procedures.ToList(new { ObjectID = obj.ObjectID });
            if (procedures.Count > 0 && procedures.FirstOrDefault(p => !Common.IsStringNull(p["Name"])) != null)
            {
                sb.AppendWithTabs("public static class Db", tabs + 1);
                sb.AppendWithTabs("{", tabs + 1);
                foreach (var item in procedures)
                {
                    Procedures.Set(sb, tabs, item);
                }
                sb.AppendWithTabs("}", tabs + 1);
            }
        }

        
    }
        
    public static class Fields
    {
        public static void AddProperty(System.Text.StringBuilder stringBuilder, dynamic obj, int tabs = 0)
        {
            //private string m_ClassName; public string ClassName { get { return m_ClassName; } set { if (value != m_ClassName) { m_ClassName = value; obj.ChangingProperty = "ClassName"; obj.ObjectState = SwordState.Dirty; } } }

            if (obj.Include)
            {
                obj.SqlDbType = (SqlDbType)obj.SqlDbType;
                string type = Common.NetType(obj.SqlDbType);
                if (obj.UDT != null && obj.UDT is string && !Common.IsStringNull(obj.UDT))
                {
                    type = (string)obj.UDT;
                }                
                string propertyName = (string)obj.PropertyName;
                if (!Common.IsStringNull(obj.GetMethod) || !Common.IsStringNull(obj.SetMethod) || obj.UseChangeEvent || !Common.IsStringNull(obj.DefaultValue))
                {

                    var defaultValue = Common.IsStringNull(obj.DefaultValue) ? default(string) : (string)obj.DefaultValue;

                    stringBuilder.AppendWithTabs("private " + type.ToString() + " m_" + propertyName + (!Common.IsStringNull(defaultValue) ? " = " + defaultValue + ";" : ";"), tabs);
                    if (!obj.JsonSerializable)
                    {
                        stringBuilder.AppendWithTabs("", tabs);
                    }
                    if (!obj.XmlSerializable)
                    {
                        stringBuilder.AppendWithTabs("", tabs);
                    }
                    stringBuilder.AppendWithTabs("public " + type + " " + propertyName, tabs);
                    stringBuilder.AppendWithTabs("{", tabs);
                    if (Common.IsStringNull(obj.GetMethod))
                    {
                        stringBuilder.AppendWithTabs("get { return m_" + propertyName + "; }", tabs + 1);
                    }
                    else
                    {
                        var getMethod = (string)obj.GetMethod;
                        stringBuilder.AppendWithTabs("get { return " + getMethod + "(); }", tabs + 1);
                    }
                    if (!obj.IsReadOnly)
                    {
                        stringBuilder.AppendWithTabs("set", tabs + 1);
                        stringBuilder.AppendWithTabs("{", tabs + 1);
                        if (!Common.IsStringNull(obj.SetMethod))
                        {
                            var setMethod = (string)obj.SetMethod;
                            stringBuilder.AppendWithTabs(setMethod + "(value);", tabs + 2);
                        }
                        else
                        {
                            if (obj.UseChangeEvent)
                            {
                                stringBuilder.AppendWithTabs("if (value != m_" + propertyName + ")", tabs + 2);
                                stringBuilder.AppendWithTabs("{", tabs + 2);
                                stringBuilder.AppendWithTabs("m_" + propertyName + " = value;", tabs + 3);
                                stringBuilder.AppendWithTabs("this.ChangingProperty = \"" + propertyName + "\";", tabs + 3);
                                stringBuilder.AppendWithTabs("this.ObjectState = SwordState.Dirty;", tabs + 3);
                                stringBuilder.AppendWithTabs("}", tabs + 2);
                            }
                            else
                            {
                                stringBuilder.AppendWithTabs("m_" + propertyName + " = value;", tabs + 2);
                            }
                        }
                        stringBuilder.AppendWithTabs("}", tabs + 1);
                    }
                    stringBuilder.AppendWithTabs("}", tabs);
                }
                else
                {
                    if (!obj.JsonSerializable)
                    {
                        stringBuilder.AppendWithTabs("", tabs);
                    }
                    if (!obj.XmlSerializable)
                    {
                        stringBuilder.AppendWithTabs("", tabs);
                    }
                    stringBuilder.AppendWithTabs("public " + type.ToString() + " " + propertyName + "{ get; set; }", tabs);
                }
            }
        }

        public static void SetISword(System.Text.StringBuilder sb, int tabs, List<DynamicSword> fields, dynamic obj)
        {
            sb.AppendWithTabs("#region ISword", tabs + 1);
            //get, set and has methods
            sb.AppendWithTabs("public override object GetValue(string propertyName)", tabs + 1);
            sb.AppendWithTabs("{", tabs + 1);
            sb.AppendWithTabs("switch (propertyName)", tabs + 2);
            sb.AppendWithTabs("{", tabs + 2);
            foreach (var item in fields)
            {
                Fields.AddGetValue(sb, item, tabs + 3);
            }
            sb.AppendWithTabs("default:", tabs + 3);
            sb.AppendWithTabs("return null;", tabs + 4);
            sb.AppendWithTabs("}", tabs + 2);
            sb.AppendWithTabs("}", tabs + 1, true);

            sb.AppendWithTabs("public override void SetValue(string propertyName, object value)", tabs + 1);
            sb.AppendWithTabs("{", tabs + 1);
            sb.AppendWithTabs("switch (propertyName)", tabs + 2);
            sb.AppendWithTabs("{", tabs + 2);
            foreach (var item in fields)
            {
                Fields.AddSetValue(sb, item, tabs + 3);
            }
            sb.AppendWithTabs("default:", tabs + 3);
            sb.AppendWithTabs("break;", tabs + 4);
            sb.AppendWithTabs("}", tabs + 2);
            sb.AppendWithTabs("}", tabs + 1, true);
            Fields.SetDirectMethod(sb, fields, tabs);


            //        public virtual string[] SerializableProperties()
            //{
            //  return null;
            //}

            var serializableFields = fields.Where(f => (bool)f["JsonSerializable"]).Select(f => "\"" + (string)f["PropertyName"] + "\"").ToList();
            if (serializableFields.Count > 0)
            {
                sb.AppendWithTabs("public override string[] SerializableProperties() { return new string[]{" +
                string.Join(",", serializableFields) + "}; }"
                , tabs + 1);
            }



            //sb.AppendWithTabs("public " + (this.UseObjectState ? "override " : "") + "bool HasProperty(string propertyName)", tabs + 1);
            //sb.AppendWithTabs("{", tabs + 1);
            //if (this.Fields.Count > 0)
            //{
            //    sb.AppendWithTabs("switch (propertyName)", tabs + 2);
            //    sb.AppendWithTabs("{", tabs + 2);
            //    foreach (var item in this.Fields)
            //    {
            //        item.AddHasValue(sb, tabs + 3);
            //    }
            //    sb.AppendWithTabs("return true;", tabs + 4);
            //    sb.AppendWithTabs("default:", tabs + 3);
            //    sb.AppendWithTabs("return false;", tabs + 4);
            //    sb.AppendWithTabs("}", tabs + 2);
            //}
            //else
            //{
            //    sb.AppendWithTabs("return false;", tabs + 2);
            //}
            //sb.AppendWithTabs("}", tabs + 1, true);

            if (fields.Count > 0)
            {
                var temp = fields.Where(f => (bool)f["Include"]).Select(f => "\"" + (string)f["PropertyName"] + "\"").ToList();
                foreach (dynamic field in fields)
                {
                    //aliases
                    if (!Common.IsStringNull(field.Aliases))
                    {
                        var aliases = (string[])field.Aliases.Split(new string[] { ";" }, System.StringSplitOptions.None);
                        temp.AddRange(aliases.Select(f => "\"" + f + "\""));
                    }
                }


                sb.AppendWithTabs("public override string[] GetStaticallyTypedPropertyNames() { return new string[]{" +
                string.Join(",", temp) + "}; }"
                , tabs + 1);
                //sb.AppendWithTabs("public " + (this.UseObjectState ? "override " : "") + "string[] GetStaticallyTypedPropertyNames()", tabs + 1);
                //sb.AppendWithTabs("{", tabs + 1);
                //  sb.AppendWithTabs("return new string[]{" + string.Join(",", fields) + "};", tabs + 2);
                //                sb.AppendWithTabs("}", tabs + 1);
            }
            string[] pks = null;
            if (!Common.IsStringNull(obj.PK))
            {
                pks = obj.PK.Split(new char[] { ';' }, System.StringSplitOptions.None);
                pks = pks.Select(s => "\"" + s.Trim() + "\"").ToArray();
            }
            if (pks != null && pks.Length > 0)
            {
                sb.AppendWithTabs("/// <summary>", tabs + 1);
                sb.AppendWithTabs("/// " + string.Join(", ", pks.Select(s => s.Replace("\"", "")).ToArray()), tabs + 1);
                sb.AppendWithTabs("/// </summary>", tabs + 1);
            }
            AddSerializationIgnore(sb, tabs + 1);
            sb.AppendWithTabs("public " + (obj.UseObjectState ? "override " : "") + "string[] PrimaryKeys { get { return " +
                (!Common.IsStringNull(obj.PK) ? "new string[]{" + string.Join(",", pks) + "};" : "null;") + " } }"
            , tabs + 1);

            AddSerializationIgnore(sb, tabs + 1);
            var tableName = Common.IsStringNull(obj.TableName) ? default(string) : (string)obj.TableName;
            if (!Common.IsStringNull(tableName))
            {
                sb.AppendWithTabs("public override string Table { get { return " +
                (!Common.IsStringNull(tableName) ? "\"" + tableName + "\";" : "null;") + " } }"
                , tabs + 1);
            }


            AddSerializationIgnore(sb, tabs + 1);
            var defaultConnectionString = (string)obj.DefaultConnectionString ?? default(string);
            sb.AppendWithTabs("public override string ObjectConnectionString { get { return " +
            (!Common.IsStringNull(defaultConnectionString) ? (defaultConnectionString.IndexOf("ConnectionString.") == -1 ? "\"" + defaultConnectionString + "\";" : defaultConnectionString + ";") : "null;") + " } }",
            tabs + 1);

            //sb.AppendWithTabs("public " + (this.UseObjectState ? "override " : "") + "bool CanDelete()", tabs + 1);
            //sb.AppendWithTabs("{", tabs + 1);            
            //sb.AppendWithTabs("return " + (this.AllowDeletes ? "true;" : "false;"), tabs + 2);
            //sb.AppendWithTabs("}", tabs + 1);
            var tableFields = fields.Where(f => (bool)f["Include"] && !Common.IsStringNull(f["TableName"])).ToList();
            sb.AppendWithTabs("public override string[] TableFields() { return " +
                (tableFields.Count > 0 ? "new string[]{" + string.Join(",", tableFields.Select(o => "\"" + (string)o["TableName"] + "\"")) + "};" : "null;") + " } "
            , tabs + 1);


            //if (tableFields.Count > 0)
            //{
            //    sb.AppendWithTabs("return new string[]{" + string.Join(",", tableFields.Select(o=> "\"" + o.TableName + "\"")) + "};" , tabs + 2);
            //}
            //else
            //{
            //    sb.AppendWithTabs("return null;", tabs + 2);
            //}
            //sb.AppendWithTabs("}", tabs + 1);
            //sb.AppendWithTabs("public " + (this.UseObjectState ? "override " : "") + "bool CanInsert()", tabs + 1);
            //sb.AppendWithTabs("{", tabs + 1);
            //sb.AppendWithTabs("return " + (this.AllowInserts ? "true;" : "false;"), tabs + 2);
            //sb.AppendWithTabs("}", tabs + 1);

            //sb.AppendWithTabs("public " + (this.UseObjectState ? "override " : "") + "string ScopeIdentity()", tabs + 1);
            //sb.AppendWithTabs("{", tabs + 1);
            //sb.AppendWithTabs("return " + (!Common.IsStringNull(this.ScopeID) ? "\"" + this.ScopeID + "\";" : "null;"), tabs + 2);
            //sb.AppendWithTabs("}", tabs + 1);
            //string ScopeIdentity();

            sb.AppendWithTabs("#endregion", tabs + 1, true);

        }

        public static void SetDirectMethod(System.Text.StringBuilder sb, List<DynamicSword> fields,  int tabs)
        {

            sb.AppendWithTabs("public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)", tabs + 1);
            sb.AppendWithTabs("{", tabs + 1);

            //all fields and aliases
            foreach (dynamic field in fields)
            {
                if (field.Include)
                {
                    Fields.AddSetValue2(sb, field, tabs + 2);
                }
            }
            sb.AppendWithTabs("}", tabs + 1);


            sb.AppendWithTabs("public override void SetValues(object[] values, Dictionary<string, MapPoint> map)", tabs + 1);
            sb.AppendWithTabs("{", tabs + 1);

            //all fields and aliases
            foreach (dynamic field in fields)
            {
                if (field.Include)
                {
                    Fields.AddSetValue3(sb, field, tabs + 2);
                }
            }
            sb.AppendWithTabs("}", tabs + 1);
        }

        public static void AddGetValue(System.Text.StringBuilder sb, dynamic obj, int tabs = 0)
        {
            if (obj.Include)
            {
                if (!Common.IsStringNull(obj.Aliases))
                {
                    var aliases = obj.Aliases.Split(new string[] { ";" }, System.StringSplitOptions.None);
                    foreach (var item in aliases)
                    {
                        string temp = (string)item;
                        sb.AppendWithTabs("case \"" + temp + "\":", tabs);
                    }
                }
                string propertyName = (string)obj.PropertyName;
                if (obj.SqlDbType != SqlDbType.DateTime)
                {   
                    sb.AppendWithTabs("case \"" + propertyName + "\": return this." + propertyName + ";", tabs);
                }
                else
                {
                    sb.AppendWithTabs("case \"" + propertyName + "\": return this." + propertyName + " == System.DateTime.MinValue ? null : (object)this." + propertyName + ";", tabs);
                }
            }
        }

        public static void AddSetValue(System.Text.StringBuilder sb, dynamic obj, int tabs = 0)
        {
            if (obj.Include)
            {
                var propertyName = (string)obj.PropertyName;
                var Setter = "";
                if (obj.IsEnum && !Common.IsStringNull(obj.UDT))
                {
                    Setter = "Setters.Enum<" + obj.UDT + ">(value);";
                }
                else
                {
                    SqlDbType sqlDbType = (SqlDbType)obj.SqlDbType;
                    #region standard sets
                    switch (sqlDbType)
                    {
                        case System.Data.SqlDbType.BigInt:
                            Setter = "Setters.Long(value);";
                            break;
                        case System.Data.SqlDbType.VarBinary:
                        case System.Data.SqlDbType.Image:
                        case System.Data.SqlDbType.Binary:
                            Setter = "(byte[])value;";
                            break;
                        case System.Data.SqlDbType.Bit:
                            Setter = "Setters.Bool(value);";
                            break;
                        case System.Data.SqlDbType.SmallDateTime:
                        case System.Data.SqlDbType.DateTimeOffset:
                        case System.Data.SqlDbType.DateTime2:
                        case System.Data.SqlDbType.DateTime:
                        case System.Data.SqlDbType.Date:
                            Setter = "Setters.DateTime(value);";
                            break;
                        case System.Data.SqlDbType.SmallMoney:
                        case System.Data.SqlDbType.Money:
                        case System.Data.SqlDbType.Decimal:
                            Setter = "Setters.Decimal(value);";
                            break;
                        case System.Data.SqlDbType.Float:
                            Setter = "Setters.Double(value);";
                            break;
                        case System.Data.SqlDbType.Int:
                            Setter = "Setters.Int(value);";
                            break;
                        case System.Data.SqlDbType.NChar:
                        case System.Data.SqlDbType.Char:
                            Setter = "Setters.Char(value);";
                            break;
                        case System.Data.SqlDbType.Xml:
                        case System.Data.SqlDbType.VarChar:
                        case System.Data.SqlDbType.Text:
                        case System.Data.SqlDbType.NVarChar:
                        case System.Data.SqlDbType.NText:
                            Setter = "Setters.String(value);";
                            break;
                        case System.Data.SqlDbType.Real:
                            Setter = "Setters.Single(value);";
                            break;
                        case System.Data.SqlDbType.SmallInt:
                            Setter = "Setters.Short(value);";
                            break;
                        case System.Data.SqlDbType.TinyInt:
                            Setter = "Setters.Byte(value);";
                            break;
                        case System.Data.SqlDbType.UniqueIdentifier:
                            Setter = "Setters.Guid(value);";
                            break;
                        case System.Data.SqlDbType.Time:
                            Setter = "Setters.TimeSpan(value);";
                            break;
                        case System.Data.SqlDbType.Udt:
                        case System.Data.SqlDbType.Timestamp:
                        case System.Data.SqlDbType.Structured:
                        case System.Data.SqlDbType.Variant:
                        default:
                            var type = Common.NetType((SqlDbType)obj.SqlDbType);
                            Setter = "(" + (type == "unknown" ? obj.UDT : type) + ")value;";
                            break;
                    }
                    #endregion
                }
                Setter = "this." + propertyName + " = " + Setter + " break;";
                if (Setter != "")
                {
                    if (!Common.IsStringNull(obj.Aliases))
                    {
                        sb.AppendWithTabs("case \"" + propertyName + "\":", tabs);
                        var aliases = obj.Aliases.Split(new string[] { ";" }, System.StringSplitOptions.None);
                        foreach (var item in aliases)
                        {
                            var temp = (string)item;
                            sb.AppendWithTabs("case \"" + temp + "\":", tabs);
                        }
                        sb.AppendWithTabs(Setter, tabs + 1);
                    }
                    else
                    {
                        sb.AppendWithTabs("case \"" + propertyName + "\": " + Setter, tabs);
                    }
                }
            }
        }

        public static void AddSetValue3(System.Text.StringBuilder sb, dynamic obj, int tabs = 0)
        {

            //reader, map["ClassName"], obj.ClassName);
            var propertyName = (string)obj.PropertyName;
            var prefix = "this." + propertyName + " = ";
            var suffix = "values, map[\"" + propertyName + "\"], " + propertyName + ");";
            string aliasSuffix = "values, map[\"[Alias]\"], " + propertyName + ");";
            if (obj.Include && obj.IncludeInSetValue)
            {
                var Setter = "";
                if (obj.IsEnum && !Common.IsStringNull(obj.UDT))
                {
                    Setter = "Setters.Enum<" + obj.UDT + ">(" + suffix;
                }
                else
                {
                    SqlDbType sqlDbType = (SqlDbType)obj.SqlDbType;
                    #region standard sets
                    switch (sqlDbType)
                    {
                        case System.Data.SqlDbType.BigInt:
                            Setter = "Setters.Long(" + suffix;
                            break;
                        case System.Data.SqlDbType.VarBinary:
                        case System.Data.SqlDbType.Image:
                        case System.Data.SqlDbType.Binary:
                            Setter = "Setters.Bytes(" + suffix;
                            break;
                        case System.Data.SqlDbType.Bit:
                            Setter = "Setters.Bool(" + suffix;
                            break;
                        case System.Data.SqlDbType.SmallDateTime:
                        case System.Data.SqlDbType.DateTimeOffset:
                        case System.Data.SqlDbType.DateTime2:
                        case System.Data.SqlDbType.DateTime:
                        case System.Data.SqlDbType.Date:
                            Setter = "Setters.DateTime(" + suffix;
                            break;
                        case System.Data.SqlDbType.SmallMoney:
                        case System.Data.SqlDbType.Money:
                        case System.Data.SqlDbType.Decimal:
                            Setter = "Setters.Decimal(" + suffix;
                            break;
                        case System.Data.SqlDbType.Float:
                            Setter = "Setters.Double(" + suffix;
                            break;
                        case System.Data.SqlDbType.Int:
                            Setter = "Setters.Int(" + suffix;
                            break;
                        case System.Data.SqlDbType.NChar:
                        case System.Data.SqlDbType.Char:
                            Setter = "Setters.Char(" + suffix;
                            break;
                        case System.Data.SqlDbType.Xml:
                        case System.Data.SqlDbType.VarChar:
                        case System.Data.SqlDbType.Text:
                        case System.Data.SqlDbType.NVarChar:
                        case System.Data.SqlDbType.NText:
                            Setter = "Setters.String(" + suffix;
                            break;
                        case System.Data.SqlDbType.Real:
                            Setter = "Setters.Single(" + suffix;
                            break;
                        case System.Data.SqlDbType.SmallInt:
                            Setter = "Setters.Short(" + suffix;
                            break;
                        case System.Data.SqlDbType.TinyInt:
                            Setter = "Setters.Byte(" + suffix;
                            break;
                        case System.Data.SqlDbType.UniqueIdentifier:
                            Setter = "Setters.Guid(" + suffix;
                            break;
                        case System.Data.SqlDbType.Time:
                            Setter = "Setters.TimeSpan(" + suffix;
                            break;
                        case System.Data.SqlDbType.Udt:
                        case System.Data.SqlDbType.Timestamp:                        
                        case System.Data.SqlDbType.Structured:
                        case System.Data.SqlDbType.Variant:
                        default:
                            var type = Common.NetType((SqlDbType)obj.SqlDbType);
                            Setter = "(" + (type == "unknown" ? obj.UDT : type) + ")value;";
                            break;
                    }
                    #endregion
                }


                if (Setter != "")
                {
                    sb.AppendWithTabs(prefix + Setter, tabs + 1);
                    if (!Common.IsStringNull(obj.Aliases))
                    {
                        var aliases = obj.Aliases.Split(new string[] { ";" }, System.StringSplitOptions.None);
                        foreach (var alias in aliases)
                        {
                            var temp = (string)alias;
                            sb.AppendWithTabs(prefix + Setter.Replace("map[\"" + propertyName + "\"]", "map[\"" + temp + "\"]"), tabs + 1);
                        }
                    }
                }
            }
        }

        public static void AddSetValue2(System.Text.StringBuilder sb, dynamic obj, int tabs = 0)
        {
            var propertyName = (string)obj.PropertyName;
            //reader, map["ClassName"], obj.ClassName);
            var prefix = "this." + propertyName + " = ";
            var suffix = "reader, map[\"" + propertyName + "\"], " + propertyName + ");";
            string aliasSuffix = "reader, map[\"[Alias]\"], " + propertyName + ");";
            if (obj.Include && obj.IncludeInSetValue)
            {
                var Setter = "";
                if (obj.IsEnum && !Common.IsStringNull(obj.UDT))
                {
                    Setter = "Setters.Enum<" + obj.UDT + ">(" + suffix;
                }
                else
                {
                    SqlDbType sqlDbType = (SqlDbType)obj.SqlDbType;
                    #region standard sets
                    switch (sqlDbType)
                    {
                        case System.Data.SqlDbType.BigInt:
                            Setter = "Setters.Long(" + suffix;
                            break;
                        case System.Data.SqlDbType.VarBinary:
                        case System.Data.SqlDbType.Image:
                        case System.Data.SqlDbType.Binary:
                            Setter = "Setters.Bytes(" + suffix;
                            break;
                        case System.Data.SqlDbType.Bit:
                            Setter = "Setters.Bool(" + suffix;
                            break;
                        case System.Data.SqlDbType.SmallDateTime:
                        case System.Data.SqlDbType.DateTimeOffset:
                        case System.Data.SqlDbType.DateTime2:
                        case System.Data.SqlDbType.DateTime:
                        case System.Data.SqlDbType.Date:
                            Setter = "Setters.DateTime(" + suffix;
                            break;
                        case System.Data.SqlDbType.SmallMoney:
                        case System.Data.SqlDbType.Money:
                        case System.Data.SqlDbType.Decimal:
                            Setter = "Setters.Decimal(" + suffix;
                            break;
                        case System.Data.SqlDbType.Float:
                            Setter = "Setters.Double(" + suffix;
                            break;
                        case System.Data.SqlDbType.Int:
                            Setter = "Setters.Int(" + suffix;
                            break;
                        case System.Data.SqlDbType.NChar:
                        case System.Data.SqlDbType.Char:
                            Setter = "Setters.Char(" + suffix;
                            break;
                        case System.Data.SqlDbType.Xml:
                        case System.Data.SqlDbType.VarChar:
                        case System.Data.SqlDbType.Text:
                        case System.Data.SqlDbType.NVarChar:
                        case System.Data.SqlDbType.NText:
                            Setter = "Setters.String(" + suffix;
                            break;
                        case System.Data.SqlDbType.Real:
                            Setter = "Setters.Single(" + suffix;
                            break;
                        case System.Data.SqlDbType.SmallInt:
                            Setter = "Setters.Short(" + suffix;
                            break;
                        case System.Data.SqlDbType.TinyInt:
                            Setter = "Setters.Byte(" + suffix;
                            break;
                        case System.Data.SqlDbType.UniqueIdentifier:
                            Setter = "Setters.Guid(" + suffix;
                            break;
                        case System.Data.SqlDbType.Time:
                            Setter = "Setters.TimeSpan(" + suffix;
                            break;
                        case System.Data.SqlDbType.Udt:
                        case System.Data.SqlDbType.Timestamp:
                        case System.Data.SqlDbType.Structured:
                        case System.Data.SqlDbType.Variant:
                        default:
                            var type = Common.NetType((SqlDbType)obj.SqlDbType);
                            Setter = "(" + (type == "unknown" ? obj.UDT : type) + ")value;";
                            break;
                    }
                    #endregion
                }


                if (Setter != "")
                {
                    sb.AppendWithTabs(prefix + Setter, tabs + 1);
                    if (!Common.IsStringNull(obj.Aliases))
                    {
                        var aliases = obj.Aliases.Split(new string[] { ";" }, System.StringSplitOptions.None);
                        foreach (var alias in aliases)
                        {
                            var temp = (string)alias;
                            sb.AppendWithTabs(prefix + Setter.Replace("map[\"" + propertyName + "\"]", "map[\"" + temp + "\"]"), tabs + 1);
                        }
                    }
                }
            }
        }

        public static void AddHasValue(System.Text.StringBuilder sb, dynamic obj, int tabs = 0)
        {
            if (obj.Include)
            {
                var propertyName = (string)obj.PropertyName;
                if (!Common.IsStringNull(obj.Aliases))
                {
                    var aliases = obj.Aliases.Split(new string[] { ";" }, System.StringSplitOptions.None);
                    foreach (var item in aliases)
                    {
                        var temp = (string)item;
                        sb.AppendWithTabs("case \"" + temp + "\":", tabs);
                    }
                }
                sb.AppendWithTabs("case \"" + propertyName + "\":", tabs);
            }
        }

        public static void AddSerializationIgnore(System.Text.StringBuilder sb, int tabs)
        {
            sb.AppendWithTabs("", tabs);
            sb.AppendWithTabs("", tabs);
        }
    }

    public static class Procedures
    {
        public static void Set(System.Text.StringBuilder sb, int tabs, dynamic obj)
        {

            if (!Common.IsStringNull(obj.Name))
            {
                string name = (string)obj.Name;
                CommandType commandType = (CommandType)obj.CommandType;
                string commandText = (string)obj.CommandText;
                string connectionString = (string)obj.StaticConnectionString;
                sb.AppendWithTabs("public static SqlCommand " + name, tabs + 2);
                sb.AppendWithTabs("{", tabs + 2);
                sb.AppendWithTabs("get", tabs + 3);
                sb.AppendWithTabs("{", tabs + 3);
                sb.AppendWithTabs("SqlCommand ret = new SqlCommand();", tabs + 4);
                sb.AppendWithTabs("ret.CommandType = System.Data.CommandType." + commandType.ToString() + ";", tabs + 4);
                sb.AppendWithTabs("ret.CommandText = @\"" + commandText + "\";", tabs + 4);
                sb.AppendWithTabs("ret.Connection = new SqlConnection(" + (connectionString == "ConnectionString.Method" ? connectionString + "()" : connectionString) + ");", tabs + 4);
                var parameters = Universal.Parameters.ToList(new { ProcedureID = obj.ProcedureID });
                foreach (var item in parameters)
                {
                    Parameters.Set(sb, tabs, item);                    
                }
                sb.AppendWithTabs("return ret;", tabs + 4);
                sb.AppendWithTabs("}", tabs + 3);
                sb.AppendWithTabs("}", tabs + 2);
            }
        }
    }

    public static class Parameters
    {
        public static void Set(System.Text.StringBuilder sb, int tabs, dynamic obj)
        {
            SqlDbType dbtype = (SqlDbType)obj.SqlDbType;
            string name = (string)obj.Name;
            System.Data.ParameterDirection direction = (System.Data.ParameterDirection)obj.Direction;
            int size = (int)obj.Size;
            byte scale = obj.Scale != null && obj.Scale is byte ? (byte)obj.Scale : (byte)0;
            byte precision = obj.Precision != null && obj.Precision is byte ? (byte)obj.Precision : (byte)0;
            string sourceColumn = Common.IsStringNull(obj.SourceColumn) ? name.Replace("@", "") : (string)obj.SourceColumn;
            string defaultValue = Common.IsStringNull(obj.DefaultValue) ? default(string) : (string)obj.DefaultValue;
            sb.AppendWithTabs(
                "ret.Parameters.Add(new SqlParameter { ParameterName = \"" + name +
                    "\", SqlDbType = System.Data.SqlDbType." + dbtype.ToString() +
                    ", Direction = System.Data.ParameterDirection." + direction.ToString() +
                    ", Size = " + size.ToString() +
                    (scale > 0 ? ", Scale = " + scale.ToString() : "") +
                    (precision > 0 ? ", Precision = " + precision.ToString() : "") +
                    ", SourceColumn = \"" + (!string.IsNullOrEmpty(sourceColumn) ? sourceColumn : name.Replace("@", "")) + "\"" +
                    (!string.IsNullOrEmpty(defaultValue) ? ", Value = " + defaultValue : "") +
                    " });"
                , tabs + 4);
        }
    }

    public static class Tables
    {
        public static void Set(System.Text.StringBuilder sb, List<DynamicSword> tables)
        {
            sb.AppendWithTabs("public static class Tables", 1);
            sb.AppendWithTabs("{", 1);
            foreach (var item in tables)
            {
                dynamic table = item;
                table.ObjectName = ((string)table.TableName).Replace(" ", "");
                sb.AppendWithTabs("public static DynamicTable " + (string)table.ObjectName + " = new DynamicTable(\"" + (string)table.TableName + "\", ConnectionString.Method);", 2);
            }
            sb.AppendWithTabs("public static void Update(this string tableName, DynamicSword parameters)", 2);
            sb.AppendWithTabs("{", 2);
            sb.AppendWithTabs("var found = Sword.Data.Tables.FirstOrDefault(t=>t.Name == tableName);", 3);
            sb.AppendWithTabs("if(found!=null)", 3);
            sb.AppendWithTabs("{", 3);
            sb.AppendWithTabs("found.Update(parameters);", 4);
            sb.AppendWithTabs("}", 3);
            sb.AppendWithTabs("}", 2);
            sb.AppendWithTabs("/// <summary>", 2);
            sb.AppendWithTabs("/// Requires a value for the parameters \"Table\" property", 2);
            sb.AppendWithTabs("/// </summary>", 2);
            sb.AppendWithTabs("/// <param name=\"parameters\"></param>", 2);
            sb.AppendWithTabs("public static void Update(this DynamicSword parameters)", 2);
            sb.AppendWithTabs("{", 2);
            sb.AppendWithTabs("var found = Sword.Data.Tables.FirstOrDefault(t => t.Name == parameters.Table);", 3);
            sb.AppendWithTabs("if (found != null)", 3);
            sb.AppendWithTabs("{", 3);
            sb.AppendWithTabs("found.Update(parameters);", 4);
            sb.AppendWithTabs("}", 3);
            sb.AppendWithTabs("}", 2);
            sb.AppendWithTabs("static Tables()", 2);
            sb.AppendWithTabs("{", 2);
            foreach (var item in tables)
            {
                dynamic table = item;
                sb.AppendWithTabs("Sword.Data.Tables.Add(" + (string)table.ObjectName + ");", 3);
            }
            sb.AppendWithTabs("}", 2);
            sb.AppendWithTabs("}", 1);
        }
    }

    public static class ProjectProcedures
    {
        public static void Set(System.Text.StringBuilder sb, dynamic obj)
        {

            //get project procedures
            var schemaRoutines = "select ROUTINE_NAME CommandText from INFORMATION_SCHEMA.ROUTINES where ROUTINE_SCHEMA = 'dbo' and ROUTINE_TYPE ='PROCEDURE' and Routine_Name not like 'sp%diagram%' and Routine_Name not like 'MSmerge%' order by CommandText;";
            var defaultConnection = (string)obj.DefaultConnectionString;
            var cmd = schemaRoutines.GetCommand(defaultConnection);
            var foundItems = Sword.Data.ToList<DynamicSword>(cmd);
            //.ToList<ProjectProcedure>();
            var existing = Universal.ProjectProcedures.ToList(new { ProjectID = obj.ProjectID });
            existing.ForEach(e =>
                e["Processed"] = false);
            //do all founds first
            //List<ProjectProcedure> newItems = new List<ProjectProcedure>();
            foreach (dynamic item in foundItems)
            {
                item.ProjectProcedureID = 0;
                item.ProjectID = obj.ProjectID;
                item.Alias = item.CommandText.Replace("#", "Number").Replace("$", "Dollar").Replace("&", "And").Replace("@", "At");
                item.Wrapper = null;
                item.Processed = false;
                //var found = existing.FirstOrDefault(p => p.CommandText == item.CommandText);
                //if (found == null)
                //{   
                //    newItems.Add(item);
                //}
            }
            //newItems.Update(ProjectProcedure.Db.Insert);
            while (existing.FirstOrDefault(e => !(bool)e["Processed"] && !Common.IsStringNull(e["Wrapper"])) != null)
            {
                var first = existing.FirstOrDefault(e => !(bool)e["Processed"]);
                var all = existing.Where(e => (string)e["Wrapper"] == (string)first["Wrapper"]).ToList();
                //foreach
                sb.AppendWithTabs("public static class " + first["Wrapper"], 2);
                sb.AppendWithTabs("{", 2);
                foreach (var item in all)
                {
                    item["Processed"] = true;
                    ProjectProcedures.SetTextGet(sb, 2, item);
                }
                sb.AppendWithTabs("}", 2);
            }
            var orderedNewItems = foundItems.OrderBy(i => i["Alias"]).ToList();
            sb.AppendWithTabs("public static class Procs", 2);
            sb.AppendWithTabs("{", 2);
            foreach (var item in orderedNewItems)
            {
                ProjectProcedures.SetTextGet(sb, 2, item);
            }
            sb.AppendWithTabs("}", 2);


        }


       public static void SetTextGet(System.Text.StringBuilder sb, int tabs, dynamic obj)
        {
            var alias = (string)obj.Alias;
            var commandText = (string)obj.CommandText;
            var command = "public static SqlCommand " + alias + "{ get { return Data.GetCommand(\"" + commandText + "\", ConnectionString.Method()); } }";
            sb.AppendWithTabs(command, tabs + 1);
            //sb.AppendWithTabs("public static SqlCommand " + alias, tabs + 1);
            //sb.AppendWithTabs("{", tabs + 1);
            //sb.AppendWithTabs("get", tabs + 2);
            //sb.AppendWithTabs("{", tabs + 2);
            //sb.AppendWithTabs("return Data.GetCommand(\"" + commandText + "\", ConnectionString.Method());", tabs + 3);
            //sb.AppendWithTabs("}", tabs + 2);
            //sb.AppendWithTabs("}", tabs + 1);
        }
    }

    public static class ConnectionStrings
    {
        public static string Set(System.Text.StringBuilder sb, dynamic obj)
        {
            var connectionStrings = Universal.ConnectionsStrings.ToList(new { ProjectID = obj.ProjectID });
            if (connectionStrings.Count > 0)
            {
                //namespace here
                var tabs = 1;

                sb.AppendWithTabs("public static class ConnectionString", tabs);
                sb.AppendWithTabs("{", tabs);
                sb.AppendWithTabs("public static string Method()", tabs + 1);
                sb.AppendWithTabs("{", tabs + 1);
                sb.AppendWithTabs("return Value;", tabs + 2);
                sb.AppendWithTabs("}", tabs + 1);
                sb.AppendWithTabs("private static string m_Value = null;", tabs + 1);

                sb.AppendWithTabs("public static string Value", tabs + 1);
                sb.AppendWithTabs("{", tabs + 1);
                sb.AppendWithTabs("get {", tabs + 2);
                sb.AppendWithTabs("string machine = System.Environment.MachineName.ToUpper();", tabs + 3);
                var production = connectionStrings.Where(c => (bool)c["IsProduction"]).ToList();
                if (production.Count > 0)
                {
                    sb.AppendWithTabs("switch (machine)", tabs + 4);
                    sb.AppendWithTabs("{", tabs + 4);
                    //production.ForEach(o => o.SetGetConnectionString(sb, tabs + 4));
                    foreach (var item in production)
                    {
                        sb.AppendWithTabs("case " + item["MachineName"].ToString().ToUpper() + ": return " + item["MachineName"].ToString().ToUpper() + "ConnectionString;", tabs + 5);
                    }
                    sb.AppendWithTabs("default: break;", tabs + 5);
                    sb.AppendWithTabs("}", tabs + 4);
                }
                sb.AppendWithTabs("if (m_Value != null)", tabs + 3);
                sb.AppendWithTabs("{", tabs + 3);
                sb.AppendWithTabs("return m_Value;", tabs + 4);
                sb.AppendWithTabs("}", tabs + 3);
                sb.AppendWithTabs("else", tabs + 3);
                sb.AppendWithTabs("{", tabs + 3);

                sb.AppendWithTabs("switch (machine)", tabs + 4);
                sb.AppendWithTabs("{", tabs + 4);
                var defaultConnection = connectionStrings.FirstOrDefault(o => (bool)o["IsDefault"] || o["MachineName"].ToString().Length > 0);
                var otherConnections = connectionStrings.Where(o => o != defaultConnection).ToList();
                otherConnections.ForEach(o => CodeConstructor.ConnectionStrings.SetGetConnectionString(sb, tabs+4, o));
                ConnectionStrings.SetGetConnectionString(sb, tabs + 4, defaultConnection);
                sb.AppendWithTabs("}", tabs + 4);
                sb.AppendWithTabs("}", tabs + 3);
                sb.AppendWithTabs("}", tabs + 2);
                sb.AppendWithTabs("set { m_Value = value; }", tabs + 2);
                sb.AppendWithTabs("}", tabs + 1, true);
                connectionStrings.ToList().ForEach(o => SetConstants(sb, tabs + 1, o));
                sb.AppendWithTabs("}", tabs);

                return sb.ToString();
            }
            else
            {
                return null;
            }
        }

        public static void SetGetConnectionString(System.Text.StringBuilder sb, int tabs, dynamic obj)
        {
            var machineName = (string)obj.MachineName ?? default(string);
            if (!Common.IsStringNull(machineName))
            {

                if (obj.IsDefault)
                {
                    sb.AppendWithTabs("case " + machineName.ToUpper() + ":", tabs + 1);
                    sb.AppendWithTabs("default: return " + machineName.ToUpper() + "ConnectionString;", tabs + 1);
                }
                else
                {
                    sb.AppendWithTabs("case " + machineName.ToUpper() + ": return " + machineName.ToUpper() + "ConnectionString;", tabs + 1);
                }
            }
        }


        public static void SetConstants(System.Text.StringBuilder sb, int tabs, dynamic obj)
        {
            var machineName = (string)obj.MachineName ?? default(string);
            sb.AppendWithTabs("public const string " + machineName.ToUpper() + " = \"" + machineName.ToUpper() + "\";", tabs);
            var value = (string)obj.Value;



            //Persist Security Info=True;
            //Password=56dFEE9a31414350

            //Password=56dFEE9a31414350;
            //Trusted_Connection=False;
            //Encrypt=True;

            if (value.IndexOf("1433") > -1)
            {
                var parts = value.Split(new string[] { ";" }, System.StringSplitOptions.None);
                string[] newParts = new string[7];
                newParts[4] = "Trusted_Connection=False";
                newParts[5] = "Encrypt=True";
                newParts[6] = "Connection Timeout=30";
                foreach (var item in parts)
                {
                    if (item.IndexOf("Data Source") > -1)
                    {
                        newParts[0] = item.Replace("Data Source=", "Server=tcp:");
                    }
                    else if (item.IndexOf("Initial Catalog") > -1)
                    {
                        newParts[1] = item.Replace("Initial Catalog", "Database");
                    }
                    else if (item.IndexOf("User ID") > -1)
                    {
                        newParts[2] = item;
                    }
                    else if (item.IndexOf("Password") > -1)
                    {
                        newParts[3] = item;
                    }
                }
                value = string.Join(";", newParts);
            }
            sb.AppendWithTabs("public const string " + machineName.ToUpper() + "ConnectionString = \"" + value + "\";", tabs);
        }
    }

    public static class Enums
    {
        public static string TypeScript(dynamic obj)
        {
            var sb = new System.Text.StringBuilder();
            var tabs = 0;
            var name = (string)obj.Name;
            sb.AppendWithTabs("enum " + name, tabs);
            sb.AppendWithTabs("{", tabs);
            if (obj.IncludeNoneValue)
            {
                sb.AppendWithTabs("None = 0,", tabs + 1);
            }
            sb.Append(string.Join(", ", enumOutput(tabs + 1, obj)));
            sb.AppendLine("};");
            return sb.ToString();
        }

        public static void Set(System.Text.StringBuilder sb, dynamic obj)
        {
            var enums = Universal.Enums.ToList(new { ProjectID = obj.ProjectID });
            foreach (dynamic item in enums)
            {
                Enums.Code(sb, item);
            }
        }

        public static void Code(System.Text.StringBuilder sb, dynamic obj)
        {
            var name = (string)obj.Name;
            var tabs = 1;
            sb.AppendWithTabs("public enum " + name, tabs);
            sb.AppendWithTabs("{", tabs);
            if (obj.IncludeNoneValue)
            {
                sb.AppendWithTabs("None = 0,", tabs + 1);
            }
            //now do select and join the output
            sb.Append(string.Join(",\r\n", enumOutput(tabs + 1, obj)));
            sb.AppendLine();
            sb.AppendWithTabs("}", tabs);
            
        }

        public static string[] enumOutput(int tabs, dynamic obj)
        {
            var temp = new List<string>();
            dynamic connection = Universal.Connections.FirstOrDefault(new { ConnectionID = obj.ConnectionID });
            using (SqlConnection conn = new SqlConnection(connection.ConnectionString))
            {
                string commandText;
                //
                var displayColumn = (string)obj.DisplayColumn;
                var valueColumn = (string)obj.ValueColumn;
                var tableName = (string)obj.TableName;
                var filterColumn = Common.IsStringNull(obj.FilterColumn) ? default(string) : (string)obj.FilterColumn;
                var filterValue = Common.IsStringNull(obj.FilterValue) ? default(string) : (string)obj.FilterValue;
                if (!Common.IsStringNull(filterColumn))
                {
                    commandText = "Select " + displayColumn + ", " + valueColumn + " from dbo.[" + tableName + "] where " + filterColumn + " = '" + filterValue + "' order by " + valueColumn;
                }
                else
                {
                    commandText = "Select " + displayColumn + ", " + valueColumn + " from dbo.[" + tableName + "] order by " + valueColumn;
                }
                using (SqlCommand command = new SqlCommand(commandText))
                {
                    command.Connection = conn;
                    conn.Open();

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            temp.Add(Common.Tabs(tabs) + reader.GetString(0).Replace(" ", "") + " = " + reader.GetValue(1).ToString());
                        }
                    }
                }
            }
            return temp.ToArray();
        }
    }

}