using System;
using Sword;
using System.Linq;
using System.Collections.Generic;
using System.Data.SqlClient;
using Newtonsoft.Json;
namespace Sword.Objects
{
    [JsonObject(MemberSerialization.OptOut)]
    public partial class ConnectionObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int ConnectionID { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "ConnectionID": return this.ConnectionID;
                case "Name": return this.Name;
                case "Value": return this.Value;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "ConnectionID": this.ConnectionID = Setters.Int(value); break;
                case "Name": this.Name = Setters.String(value); break;
                case "Value": this.Value = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.ConnectionID = Setters.Int(reader, map["ConnectionID"], ConnectionID);
            this.Name = Setters.String(reader, map["Name"], Name);
            this.Value = Setters.String(reader, map["Value"], Value);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.ConnectionID = Setters.Int(values, map["ConnectionID"], ConnectionID);
            this.Name = Setters.String(values, map["Name"], Name);
            this.Value = Setters.String(values, map["Value"], Value);
        }
        public override string[] SerializableProperties() { return new string[] { "ConnectionID", "Name", "Value" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "ConnectionID", "Name", "Value" }; }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "Connections"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "ConnectionID", "Name", "ConnectionString" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class ConnectionStringObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int ConnectionStringID { get; set; }
        public string MachineName { get; set; }
        public string Value { get; set; }
        public int ProjectID { get; set; }
        public string Target { get; set; }
        public bool IsDefault { get; set; }
        public bool IsProduction { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "ConnectionStringID": return this.ConnectionStringID;
                case "MachineName": return this.MachineName;
                case "Value": return this.Value;
                case "ProjectID": return this.ProjectID;
                case "Target": return this.Target;
                case "IsDefault": return this.IsDefault;
                case "IsProduction": return this.IsProduction;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "ConnectionStringID": this.ConnectionStringID = Setters.Int(value); break;
                case "MachineName": this.MachineName = Setters.String(value); break;
                case "Value": this.Value = Setters.String(value); break;
                case "ProjectID": this.ProjectID = Setters.Int(value); break;
                case "Target": this.Target = Setters.String(value); break;
                case "IsDefault": this.IsDefault = Setters.Bool(value); break;
                case "IsProduction": this.IsProduction = Setters.Bool(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.ConnectionStringID = Setters.Int(reader, map["ConnectionStringID"], ConnectionStringID);
            this.MachineName = Setters.String(reader, map["MachineName"], MachineName);
            this.Value = Setters.String(reader, map["Value"], Value);
            this.ProjectID = Setters.Int(reader, map["ProjectID"], ProjectID);
            this.Target = Setters.String(reader, map["Target"], Target);
            this.IsDefault = Setters.Bool(reader, map["IsDefault"], IsDefault);
            this.IsProduction = Setters.Bool(reader, map["IsProduction"], IsProduction);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.ConnectionStringID = Setters.Int(values, map["ConnectionStringID"], ConnectionStringID);
            this.MachineName = Setters.String(values, map["MachineName"], MachineName);
            this.Value = Setters.String(values, map["Value"], Value);
            this.ProjectID = Setters.Int(values, map["ProjectID"], ProjectID);
            this.Target = Setters.String(values, map["Target"], Target);
            this.IsDefault = Setters.Bool(values, map["IsDefault"], IsDefault);
            this.IsProduction = Setters.Bool(values, map["IsProduction"], IsProduction);
        }
        public override string[] SerializableProperties() { return new string[] { "ConnectionStringID", "MachineName", "Value", "ProjectID", "Target", "IsDefault", "IsProduction" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "ConnectionStringID", "MachineName", "Value", "ProjectID", "Target", "IsDefault", "IsProduction" }; }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "ConnectionStrings"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "ConnectionStringID", "MachineName", "Value", "ProjectID", "Target", "IsDefault", "IsProduction" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class EnumObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int ConnectionID { get; set; }
        public string DisplayColumn { get; set; }
        public int EnumID { get; set; }
        public string FilterColumn { get; set; }
        public string FilterValue { get; set; }
        public bool HasFlags { get; set; }
        public bool IncludeNoneValue { get; set; }
        public string Name { get; set; }
        public int ProjectID { get; set; }
        public string TableName { get; set; }
        public string ValueColumn { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "ConnectionID": return this.ConnectionID;
                case "DisplayColumn": return this.DisplayColumn;
                case "EnumID": return this.EnumID;
                case "FilterColumn": return this.FilterColumn;
                case "FilterValue": return this.FilterValue;
                case "HasFlags": return this.HasFlags;
                case "IncludeNoneValue": return this.IncludeNoneValue;
                case "Name": return this.Name;
                case "ProjectID": return this.ProjectID;
                case "TableName": return this.TableName;
                case "ValueColumn": return this.ValueColumn;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "ConnectionID": this.ConnectionID = Setters.Int(value); break;
                case "DisplayColumn": this.DisplayColumn = Setters.String(value); break;
                case "EnumID": this.EnumID = Setters.Int(value); break;
                case "FilterColumn": this.FilterColumn = Setters.String(value); break;
                case "FilterValue": this.FilterValue = Setters.String(value); break;
                case "HasFlags": this.HasFlags = Setters.Bool(value); break;
                case "IncludeNoneValue": this.IncludeNoneValue = Setters.Bool(value); break;
                case "Name": this.Name = Setters.String(value); break;
                case "ProjectID": this.ProjectID = Setters.Int(value); break;
                case "TableName": this.TableName = Setters.String(value); break;
                case "ValueColumn": this.ValueColumn = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.ConnectionID = Setters.Int(reader, map["ConnectionID"], ConnectionID);
            this.DisplayColumn = Setters.String(reader, map["DisplayColumn"], DisplayColumn);
            this.EnumID = Setters.Int(reader, map["EnumID"], EnumID);
            this.FilterColumn = Setters.String(reader, map["FilterColumn"], FilterColumn);
            this.FilterValue = Setters.String(reader, map["FilterValue"], FilterValue);
            this.HasFlags = Setters.Bool(reader, map["HasFlags"], HasFlags);
            this.IncludeNoneValue = Setters.Bool(reader, map["IncludeNoneValue"], IncludeNoneValue);
            this.Name = Setters.String(reader, map["Name"], Name);
            this.ProjectID = Setters.Int(reader, map["ProjectID"], ProjectID);
            this.TableName = Setters.String(reader, map["TableName"], TableName);
            this.ValueColumn = Setters.String(reader, map["ValueColumn"], ValueColumn);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.ConnectionID = Setters.Int(values, map["ConnectionID"], ConnectionID);
            this.DisplayColumn = Setters.String(values, map["DisplayColumn"], DisplayColumn);
            this.EnumID = Setters.Int(values, map["EnumID"], EnumID);
            this.FilterColumn = Setters.String(values, map["FilterColumn"], FilterColumn);
            this.FilterValue = Setters.String(values, map["FilterValue"], FilterValue);
            this.HasFlags = Setters.Bool(values, map["HasFlags"], HasFlags);
            this.IncludeNoneValue = Setters.Bool(values, map["IncludeNoneValue"], IncludeNoneValue);
            this.Name = Setters.String(values, map["Name"], Name);
            this.ProjectID = Setters.Int(values, map["ProjectID"], ProjectID);
            this.TableName = Setters.String(values, map["TableName"], TableName);
            this.ValueColumn = Setters.String(values, map["ValueColumn"], ValueColumn);
        }
        public override string[] SerializableProperties() { return new string[] { "ConnectionID", "DisplayColumn", "EnumID", "FilterColumn", "FilterValue", "HasFlags", "IncludeNoneValue", "Name", "ProjectID", "TableName", "ValueColumn" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "ConnectionID", "DisplayColumn", "EnumID", "FilterColumn", "FilterValue", "HasFlags", "IncludeNoneValue", "Name", "ProjectID", "TableName", "ValueColumn" }; }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "Enums"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "ConnectionID", "DisplayColumn", "EnumID", "FilterColumn", "FilterValue", "HasFlags", "IncludeNoneValue", "Name", "ProjectID", "TableName", "ValueColumn" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class FieldObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        public string Aliases { get; set; }
        public string DefaultValue { get; set; }
        public int FieldID { get; set; }
        public string GetMethod { get; set; }
        public bool Include { get; set; }
        public bool IncludeInSetValue { get; set; }
        public bool IsEnum { get; set; }
        public bool IsReadOnly { get; set; }
        public bool JsonSerializable { get; set; }
        public int ObjectID { get; set; }
        public string PropertyName { get; set; }
        public string SetMethod { get; set; }
        public int SqlDbType { get; set; }
        public string TableName { get; set; }
        public string UDT { get; set; }
        public bool UseChangeEvent { get; set; }
        public bool XmlSerializable { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "Aliases": return this.Aliases;
                case "DefaultValue": return this.DefaultValue;
                case "FieldID": return this.FieldID;
                case "GetMethod": return this.GetMethod;
                case "Include": return this.Include;
                case "IncludeInSetValue": return this.IncludeInSetValue;
                case "IsEnum": return this.IsEnum;
                case "IsReadOnly": return this.IsReadOnly;
                case "JsonSerializable": return this.JsonSerializable;
                case "ObjectID": return this.ObjectID;
                case "PropertyName": return this.PropertyName;
                case "SetMethod": return this.SetMethod;
                case "SqlDbType": return this.SqlDbType;
                case "TableName": return this.TableName;
                case "UDT": return this.UDT;
                case "UseChangeEvent": return this.UseChangeEvent;
                case "XmlSerializable": return this.XmlSerializable;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "Aliases": this.Aliases = Setters.String(value); break;
                case "DefaultValue": this.DefaultValue = Setters.String(value); break;
                case "FieldID": this.FieldID = Setters.Int(value); break;
                case "GetMethod": this.GetMethod = Setters.String(value); break;
                case "Include": this.Include = Setters.Bool(value); break;
                case "IncludeInSetValue": this.IncludeInSetValue = Setters.Bool(value); break;
                case "IsEnum": this.IsEnum = Setters.Bool(value); break;
                case "IsReadOnly": this.IsReadOnly = Setters.Bool(value); break;
                case "JsonSerializable": this.JsonSerializable = Setters.Bool(value); break;
                case "ObjectID": this.ObjectID = Setters.Int(value); break;
                case "PropertyName": this.PropertyName = Setters.String(value); break;
                case "SetMethod": this.SetMethod = Setters.String(value); break;
                case "SqlDbType": this.SqlDbType = Setters.Int(value); break;
                case "TableName": this.TableName = Setters.String(value); break;
                case "UDT": this.UDT = Setters.String(value); break;
                case "UseChangeEvent": this.UseChangeEvent = Setters.Bool(value); break;
                case "XmlSerializable": this.XmlSerializable = Setters.Bool(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.Aliases = Setters.String(reader, map["Aliases"], Aliases);
            this.DefaultValue = Setters.String(reader, map["DefaultValue"], DefaultValue);
            this.FieldID = Setters.Int(reader, map["FieldID"], FieldID);
            this.GetMethod = Setters.String(reader, map["GetMethod"], GetMethod);
            this.Include = Setters.Bool(reader, map["Include"], Include);
            this.IncludeInSetValue = Setters.Bool(reader, map["IncludeInSetValue"], IncludeInSetValue);
            this.IsEnum = Setters.Bool(reader, map["IsEnum"], IsEnum);
            this.IsReadOnly = Setters.Bool(reader, map["IsReadOnly"], IsReadOnly);
            this.JsonSerializable = Setters.Bool(reader, map["JsonSerializable"], JsonSerializable);
            this.ObjectID = Setters.Int(reader, map["ObjectID"], ObjectID);
            this.PropertyName = Setters.String(reader, map["PropertyName"], PropertyName);
            this.SetMethod = Setters.String(reader, map["SetMethod"], SetMethod);
            this.SqlDbType = Setters.Int(reader, map["SqlDbType"], SqlDbType);
            this.TableName = Setters.String(reader, map["TableName"], TableName);
            this.UDT = Setters.String(reader, map["UDT"], UDT);
            this.UseChangeEvent = Setters.Bool(reader, map["UseChangeEvent"], UseChangeEvent);
            this.XmlSerializable = Setters.Bool(reader, map["XmlSerializable"], XmlSerializable);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.Aliases = Setters.String(values, map["Aliases"], Aliases);
            this.DefaultValue = Setters.String(values, map["DefaultValue"], DefaultValue);
            this.FieldID = Setters.Int(values, map["FieldID"], FieldID);
            this.GetMethod = Setters.String(values, map["GetMethod"], GetMethod);
            this.Include = Setters.Bool(values, map["Include"], Include);
            this.IncludeInSetValue = Setters.Bool(values, map["IncludeInSetValue"], IncludeInSetValue);
            this.IsEnum = Setters.Bool(values, map["IsEnum"], IsEnum);
            this.IsReadOnly = Setters.Bool(values, map["IsReadOnly"], IsReadOnly);
            this.JsonSerializable = Setters.Bool(values, map["JsonSerializable"], JsonSerializable);
            this.ObjectID = Setters.Int(values, map["ObjectID"], ObjectID);
            this.PropertyName = Setters.String(values, map["PropertyName"], PropertyName);
            this.SetMethod = Setters.String(values, map["SetMethod"], SetMethod);
            this.SqlDbType = Setters.Int(values, map["SqlDbType"], SqlDbType);
            this.TableName = Setters.String(values, map["TableName"], TableName);
            this.UDT = Setters.String(values, map["UDT"], UDT);
            this.UseChangeEvent = Setters.Bool(values, map["UseChangeEvent"], UseChangeEvent);
            this.XmlSerializable = Setters.Bool(values, map["XmlSerializable"], XmlSerializable);
        }
        public override string[] SerializableProperties() { return new string[] { "Aliases", "DefaultValue", "FieldID", "GetMethod", "Include", "IncludeInSetValue", "IsEnum", "IsReadOnly", "JsonSerializable", "ObjectID", "PropertyName", "SetMethod", "SqlDbType", "TableName", "UDT", "UseChangeEvent", "XmlSerializable" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "Aliases", "DefaultValue", "FieldID", "GetMethod", "Include", "IncludeInSetValue", "IsEnum", "IsReadOnly", "JsonSerializable", "ObjectID", "PropertyName", "SetMethod", "SqlDbType", "TableName", "UDT", "UseChangeEvent", "XmlSerializable" }; }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "Fields"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "Aliases", "DefaultValue", "FieldID", "GetMethod", "Include", "IncludeInSetValue", "IsEnum", "IsReadOnly", "JsonSerializable", "ObjectID", "PropertyName", "SetMethod", "SqlDbType", "TableName", "UDT", "UseChangeEvent", "XmlSerializable" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class ObjectObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        public bool AllowDeletes { get; set; }
        public bool AllowInserts { get; set; }
        public string ClassName { get; set; }
        public int ConnectionID { get; set; }
        public string DefaultConnectionString { get; set; }
        public bool IsPartial { get; set; }
        public string Namespace { get; set; }
        public int ObjectID { get; set; }
        public string PK { get; set; }
        public int ProjectID { get; set; }
        public string ScopeID { get; set; }
        public string TableName { get; set; }
        public string Target { get; set; }
        public bool UseChangeEvent { get; set; }
        public bool UseObjectState { get; set; }
        public string UserCode { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "AllowDeletes": return this.AllowDeletes;
                case "AllowInserts": return this.AllowInserts;
                case "ClassName": return this.ClassName;
                case "ConnectionID": return this.ConnectionID;
                case "DefaultConnectionString": return this.DefaultConnectionString;
                case "IsPartial": return this.IsPartial;
                case "Namespace": return this.Namespace;
                case "ObjectID": return this.ObjectID;
                case "PK": return this.PK;
                case "ProjectID": return this.ProjectID;
                case "ScopeID": return this.ScopeID;
                case "TableName": return this.TableName;
                case "Target": return this.Target;
                case "UseChangeEvent": return this.UseChangeEvent;
                case "UseObjectState": return this.UseObjectState;
                case "UserCode": return this.UserCode;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "AllowDeletes": this.AllowDeletes = Setters.Bool(value); break;
                case "AllowInserts": this.AllowInserts = Setters.Bool(value); break;
                case "ClassName": this.ClassName = Setters.String(value); break;
                case "ConnectionID": this.ConnectionID = Setters.Int(value); break;
                case "DefaultConnectionString": this.DefaultConnectionString = Setters.String(value); break;
                case "IsPartial": this.IsPartial = Setters.Bool(value); break;
                case "Namespace": this.Namespace = Setters.String(value); break;
                case "ObjectID": this.ObjectID = Setters.Int(value); break;
                case "PK": this.PK = Setters.String(value); break;
                case "ProjectID": this.ProjectID = Setters.Int(value); break;
                case "ScopeID": this.ScopeID = Setters.String(value); break;
                case "TableName": this.TableName = Setters.String(value); break;
                case "Target": this.Target = Setters.String(value); break;
                case "UseChangeEvent": this.UseChangeEvent = Setters.Bool(value); break;
                case "UseObjectState": this.UseObjectState = Setters.Bool(value); break;
                case "UserCode": this.UserCode = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.AllowDeletes = Setters.Bool(reader, map["AllowDeletes"], AllowDeletes);
            this.AllowInserts = Setters.Bool(reader, map["AllowInserts"], AllowInserts);
            this.ClassName = Setters.String(reader, map["ClassName"], ClassName);
            this.ConnectionID = Setters.Int(reader, map["ConnectionID"], ConnectionID);
            this.DefaultConnectionString = Setters.String(reader, map["DefaultConnectionString"], DefaultConnectionString);
            this.IsPartial = Setters.Bool(reader, map["IsPartial"], IsPartial);
            this.Namespace = Setters.String(reader, map["Namespace"], Namespace);
            this.ObjectID = Setters.Int(reader, map["ObjectID"], ObjectID);
            this.PK = Setters.String(reader, map["PK"], PK);
            this.ProjectID = Setters.Int(reader, map["ProjectID"], ProjectID);
            this.ScopeID = Setters.String(reader, map["ScopeID"], ScopeID);
            this.TableName = Setters.String(reader, map["TableName"], TableName);
            this.Target = Setters.String(reader, map["Target"], Target);
            this.UseChangeEvent = Setters.Bool(reader, map["UseChangeEvent"], UseChangeEvent);
            this.UseObjectState = Setters.Bool(reader, map["UseObjectState"], UseObjectState);
            this.UserCode = Setters.String(reader, map["UserCode"], UserCode);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.AllowDeletes = Setters.Bool(values, map["AllowDeletes"], AllowDeletes);
            this.AllowInserts = Setters.Bool(values, map["AllowInserts"], AllowInserts);
            this.ClassName = Setters.String(values, map["ClassName"], ClassName);
            this.ConnectionID = Setters.Int(values, map["ConnectionID"], ConnectionID);
            this.DefaultConnectionString = Setters.String(values, map["DefaultConnectionString"], DefaultConnectionString);
            this.IsPartial = Setters.Bool(values, map["IsPartial"], IsPartial);
            this.Namespace = Setters.String(values, map["Namespace"], Namespace);
            this.ObjectID = Setters.Int(values, map["ObjectID"], ObjectID);
            this.PK = Setters.String(values, map["PK"], PK);
            this.ProjectID = Setters.Int(values, map["ProjectID"], ProjectID);
            this.ScopeID = Setters.String(values, map["ScopeID"], ScopeID);
            this.TableName = Setters.String(values, map["TableName"], TableName);
            this.Target = Setters.String(values, map["Target"], Target);
            this.UseChangeEvent = Setters.Bool(values, map["UseChangeEvent"], UseChangeEvent);
            this.UseObjectState = Setters.Bool(values, map["UseObjectState"], UseObjectState);
            this.UserCode = Setters.String(values, map["UserCode"], UserCode);
        }
        public override string[] SerializableProperties() { return new string[] { "AllowDeletes", "AllowInserts", "ClassName", "ConnectionID", "DefaultConnectionString", "IsPartial", "Namespace", "ObjectID", "PK", "ProjectID", "ScopeID", "TableName", "Target", "UseChangeEvent", "UseObjectState", "UserCode" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "AllowDeletes", "AllowInserts", "ClassName", "ConnectionID", "DefaultConnectionString", "IsPartial", "Namespace", "ObjectID", "PK", "ProjectID", "ScopeID", "TableName", "Target", "UseChangeEvent", "UseObjectState", "UserCode" }; }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "Objects"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "AllowDeletes", "AllowInserts", "ClassName", "ConnectionID", "DefaultConnectionString", "IsPartial", "Namespace", "ObjectID", "PK", "ProjectID", "ScopeID", "TableName", "Target", "UseChangeEvent", "UseObjectState", "UserCode" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class ParameterObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int ParameterID { get; set; }
        public int ProcedureID { get; set; }
        public byte Scale { get; set; }
        public int SqlDbType { get; set; }
        public byte Precision { get; set; }
        public int Size { get; set; }
        public int Direction { get; set; }
        public string DefaultValue { get; set; }
        public string Name { get; set; }
        public string SourceColumn { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "ParameterID": return this.ParameterID;
                case "ProcedureID": return this.ProcedureID;
                case "Scale": return this.Scale;
                case "SqlDbType": return this.SqlDbType;
                case "Precision": return this.Precision;
                case "Size": return this.Size;
                case "Direction": return this.Direction;
                case "DefaultValue": return this.DefaultValue;
                case "Name": return this.Name;
                case "SourceColumn": return this.SourceColumn;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "ParameterID": this.ParameterID = Setters.Int(value); break;
                case "ProcedureID": this.ProcedureID = Setters.Int(value); break;
                case "Scale": this.Scale = Setters.Byte(value); break;
                case "SqlDbType": this.SqlDbType = Setters.Int(value); break;
                case "Precision": this.Precision = Setters.Byte(value); break;
                case "Size": this.Size = Setters.Int(value); break;
                case "Direction": this.Direction = Setters.Int(value); break;
                case "DefaultValue": this.DefaultValue = Setters.String(value); break;
                case "Name": this.Name = Setters.String(value); break;
                case "SourceColumn": this.SourceColumn = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.ParameterID = Setters.Int(reader, map["ParameterID"], ParameterID);
            this.ProcedureID = Setters.Int(reader, map["ProcedureID"], ProcedureID);
            this.Scale = Setters.Byte(reader, map["Scale"], Scale);
            this.SqlDbType = Setters.Int(reader, map["SqlDbType"], SqlDbType);
            this.Precision = Setters.Byte(reader, map["Precision"], Precision);
            this.Size = Setters.Int(reader, map["Size"], Size);
            this.Direction = Setters.Int(reader, map["Direction"], Direction);
            this.DefaultValue = Setters.String(reader, map["DefaultValue"], DefaultValue);
            this.Name = Setters.String(reader, map["Name"], Name);
            this.SourceColumn = Setters.String(reader, map["SourceColumn"], SourceColumn);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.ParameterID = Setters.Int(values, map["ParameterID"], ParameterID);
            this.ProcedureID = Setters.Int(values, map["ProcedureID"], ProcedureID);
            this.Scale = Setters.Byte(values, map["Scale"], Scale);
            this.SqlDbType = Setters.Int(values, map["SqlDbType"], SqlDbType);
            this.Precision = Setters.Byte(values, map["Precision"], Precision);
            this.Size = Setters.Int(values, map["Size"], Size);
            this.Direction = Setters.Int(values, map["Direction"], Direction);
            this.DefaultValue = Setters.String(values, map["DefaultValue"], DefaultValue);
            this.Name = Setters.String(values, map["Name"], Name);
            this.SourceColumn = Setters.String(values, map["SourceColumn"], SourceColumn);
        }
        public override string[] SerializableProperties() { return new string[] { "ParameterID", "ProcedureID", "Scale", "SqlDbType", "Precision", "Size", "Direction", "DefaultValue", "Name", "SourceColumn" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "ParameterID", "ProcedureID", "Scale", "SqlDbType", "Precision", "Size", "Direction", "DefaultValue", "Name", "SourceColumn" }; }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "Parameters"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "ParameterID", "ProcedureID", "Scale", "SqlDbType", "Precision", "Size", "Direction", "DefaultValue", "Name", "SourceColumn" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class ProcedureObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
        }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "Procedures"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return null; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class ProjectObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        public string BuildPath { get; set; }
        public string DefaultConnectionString { get; set; }
        public string Name { get; set; }
        public string Namespace { get; set; }
        public int ProjectID { get; set; }
        public string PublishPath { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "BuildPath": return this.BuildPath;
                case "DefaultConnectionString": return this.DefaultConnectionString;
                case "Name": return this.Name;
                case "Namespace": return this.Namespace;
                case "ProjectID": return this.ProjectID;
                case "PublishPath": return this.PublishPath;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "BuildPath": this.BuildPath = Setters.String(value); break;
                case "DefaultConnectionString": this.DefaultConnectionString = Setters.String(value); break;
                case "Name": this.Name = Setters.String(value); break;
                case "Namespace": this.Namespace = Setters.String(value); break;
                case "ProjectID": this.ProjectID = Setters.Int(value); break;
                case "PublishPath": this.PublishPath = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.BuildPath = Setters.String(reader, map["BuildPath"], BuildPath);
            this.DefaultConnectionString = Setters.String(reader, map["DefaultConnectionString"], DefaultConnectionString);
            this.Name = Setters.String(reader, map["Name"], Name);
            this.Namespace = Setters.String(reader, map["Namespace"], Namespace);
            this.ProjectID = Setters.Int(reader, map["ProjectID"], ProjectID);
            this.PublishPath = Setters.String(reader, map["PublishPath"], PublishPath);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.BuildPath = Setters.String(values, map["BuildPath"], BuildPath);
            this.DefaultConnectionString = Setters.String(values, map["DefaultConnectionString"], DefaultConnectionString);
            this.Name = Setters.String(values, map["Name"], Name);
            this.Namespace = Setters.String(values, map["Namespace"], Namespace);
            this.ProjectID = Setters.Int(values, map["ProjectID"], ProjectID);
            this.PublishPath = Setters.String(values, map["PublishPath"], PublishPath);
        }
        public override string[] SerializableProperties() { return new string[] { "BuildPath", "DefaultConnectionString", "Name", "Namespace", "ProjectID", "PublishPath" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "BuildPath", "DefaultConnectionString", "Name", "Namespace", "ProjectID", "PublishPath" }; }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "Projects"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "BuildPath", "DefaultConnectionString", "Name", "Namespace", "ProjectID", "PublishPath" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class ProjectProcedureObject : DynamicSword
    {
        #region Sword Code

        #region Properties

        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
        }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string Table { get { return "ProjectProcedures"; } }
        [System.Xml.Serialization.XmlIgnoreAttribute]
        [System.Web.Script.Serialization.ScriptIgnoreAttribute]
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return null; }
        #endregion

        #endregion

    }

    public static class Tables
    {
        public static DynamicTable Accounts = new DynamicTable("Accounts", ConnectionString.Method);
        public static DynamicTable Connections = new DynamicTable("Connections", ConnectionString.Method);
        public static DynamicTable ConnectionStrings = new DynamicTable("ConnectionStrings", ConnectionString.Method);
        public static DynamicTable Enums = new DynamicTable("Enums", ConnectionString.Method);
        public static DynamicTable Fields = new DynamicTable("Fields", ConnectionString.Method);
        public static DynamicTable ObjectModel = new DynamicTable("ObjectModel", ConnectionString.Method);
        public static DynamicTable ObjectModelLog = new DynamicTable("ObjectModelLog", ConnectionString.Method);
        public static DynamicTable Objects = new DynamicTable("Objects", ConnectionString.Method);
        public static DynamicTable ObjectXmls = new DynamicTable("ObjectXmls", ConnectionString.Method);
        public static DynamicTable Parameters = new DynamicTable("Parameters", ConnectionString.Method);
        public static DynamicTable Priorities = new DynamicTable("Priorities", ConnectionString.Method);
        public static DynamicTable Procedures = new DynamicTable("Procedures", ConnectionString.Method);
        public static DynamicTable ProjectProcedures = new DynamicTable("ProjectProcedures", ConnectionString.Method);
        public static DynamicTable Projects = new DynamicTable("Projects", ConnectionString.Method);
        public static void Update(this string tableName, DynamicSword parameters)
        {
            var found = Sword.Data.Tables.FirstOrDefault(t => t.Name == tableName);
            if (found != null)
            {
                found.Update(parameters);
            }
        }
        /// <summary>
        /// Requires a value for the parameters "Table" property
        /// </summary>
        /// <param name="parameters"></param>
        public static void Update(this DynamicSword parameters)
        {
            var found = Sword.Data.Tables.FirstOrDefault(t => t.Name == parameters.Table);
            if (found != null)
            {
                found.Update(parameters);
            }
        }
        static Tables()
        {
            Sword.Data.Tables.Add(Accounts);
            Sword.Data.Tables.Add(Connections);
            Sword.Data.Tables.Add(ConnectionStrings);
            Sword.Data.Tables.Add(Enums);
            Sword.Data.Tables.Add(Fields);
            Sword.Data.Tables.Add(ObjectModel);
            Sword.Data.Tables.Add(ObjectModelLog);
            Sword.Data.Tables.Add(Objects);
            Sword.Data.Tables.Add(ObjectXmls);
            Sword.Data.Tables.Add(Parameters);
            Sword.Data.Tables.Add(Priorities);
            Sword.Data.Tables.Add(Procedures);
            Sword.Data.Tables.Add(ProjectProcedures);
            Sword.Data.Tables.Add(Projects);
        }
    }
    public static class Dbo
    {
        public static class Procs
        {
            public static SqlCommand Account_Get { get { return Data.GetCommand("Account_Get", ConnectionString.Method()); } }
            public static SqlCommand ChecklistItem_Get { get { return Data.GetCommand("ChecklistItem_Get", ConnectionString.Method()); } }
            public static SqlCommand ChecklistItem_Update { get { return Data.GetCommand("ChecklistItem_Update", ConnectionString.Method()); } }
            public static SqlCommand Connection_Get { get { return Data.GetCommand("Connection_Get", ConnectionString.Method()); } }
            public static SqlCommand Connection_Insert { get { return Data.GetCommand("Connection_Insert", ConnectionString.Method()); } }
            public static SqlCommand Connection_Update { get { return Data.GetCommand("Connection_Update", ConnectionString.Method()); } }
            public static SqlCommand ConnectionString_Delete { get { return Data.GetCommand("ConnectionString_Delete", ConnectionString.Method()); } }
            public static SqlCommand ConnectionString_Get { get { return Data.GetCommand("ConnectionString_Get", ConnectionString.Method()); } }
            public static SqlCommand ConnectionString_Insert { get { return Data.GetCommand("ConnectionString_Insert", ConnectionString.Method()); } }
            public static SqlCommand ConnectionString_Update { get { return Data.GetCommand("ConnectionString_Update", ConnectionString.Method()); } }
            public static SqlCommand Enum_Delete { get { return Data.GetCommand("Enum_Delete", ConnectionString.Method()); } }
            public static SqlCommand Enum_Get { get { return Data.GetCommand("Enum_Get", ConnectionString.Method()); } }
            public static SqlCommand Enum_Insert { get { return Data.GetCommand("Enum_Insert", ConnectionString.Method()); } }
            public static SqlCommand Enum_Update { get { return Data.GetCommand("Enum_Update", ConnectionString.Method()); } }
            public static SqlCommand ErrorLog_Update { get { return Data.GetCommand("ErrorLog_Update", ConnectionString.Method()); } }
            public static SqlCommand Field_Delete { get { return Data.GetCommand("Field_Delete", ConnectionString.Method()); } }
            public static SqlCommand Field_Get { get { return Data.GetCommand("Field_Get", ConnectionString.Method()); } }
            public static SqlCommand Field_Insert { get { return Data.GetCommand("Field_Insert", ConnectionString.Method()); } }
            public static SqlCommand Field_Update { get { return Data.GetCommand("Field_Update", ConnectionString.Method()); } }
            public static SqlCommand Item_Delete { get { return Data.GetCommand("Item_Delete", ConnectionString.Method()); } }
            public static SqlCommand Item_Get { get { return Data.GetCommand("Item_Get", ConnectionString.Method()); } }
            public static SqlCommand Item_Update { get { return Data.GetCommand("Item_Update", ConnectionString.Method()); } }
            public static SqlCommand Log_Get { get { return Data.GetCommand("Log_Get", ConnectionString.Method()); } }
            public static SqlCommand Log_Update { get { return Data.GetCommand("Log_Update", ConnectionString.Method()); } }
            public static SqlCommand LogItem_Get { get { return Data.GetCommand("LogItem_Get", ConnectionString.Method()); } }
            public static SqlCommand LogItem_Update { get { return Data.GetCommand("LogItem_Update", ConnectionString.Method()); } }
            public static SqlCommand Object_Delete { get { return Data.GetCommand("Object_Delete", ConnectionString.Method()); } }
            public static SqlCommand Object_Get { get { return Data.GetCommand("Object_Get", ConnectionString.Method()); } }
            public static SqlCommand Object_Insert { get { return Data.GetCommand("Object_Insert", ConnectionString.Method()); } }
            public static SqlCommand Object_Update { get { return Data.GetCommand("Object_Update", ConnectionString.Method()); } }
            public static SqlCommand Objectives_Get { get { return Data.GetCommand("Objectives_Get", ConnectionString.Method()); } }
            public static SqlCommand Objectives_GetFirst { get { return Data.GetCommand("Objectives_GetFirst", ConnectionString.Method()); } }
            public static SqlCommand Objectives_Update { get { return Data.GetCommand("Objectives_Update", ConnectionString.Method()); } }
            public static SqlCommand ObjectModel_Delete { get { return Data.GetCommand("ObjectModel_Delete", ConnectionString.Method()); } }
            public static SqlCommand ObjectModel_Get { get { return Data.GetCommand("ObjectModel_Get", ConnectionString.Method()); } }
            public static SqlCommand ObjectModel_Update { get { return Data.GetCommand("ObjectModel_Update", ConnectionString.Method()); } }
            public static SqlCommand ObjectModelLog_Delete { get { return Data.GetCommand("ObjectModelLog_Delete", ConnectionString.Method()); } }
            public static SqlCommand ObjectModelLog_Get { get { return Data.GetCommand("ObjectModelLog_Get", ConnectionString.Method()); } }
            public static SqlCommand ObjectModelLog_Insert { get { return Data.GetCommand("ObjectModelLog_Insert", ConnectionString.Method()); } }
            public static SqlCommand ObjectXml_Delete { get { return Data.GetCommand("ObjectXml_Delete", ConnectionString.Method()); } }
            public static SqlCommand ObjectXml_Insert { get { return Data.GetCommand("ObjectXml_Insert", ConnectionString.Method()); } }
            public static SqlCommand ObjectXml_Select { get { return Data.GetCommand("ObjectXml_Select", ConnectionString.Method()); } }
            public static SqlCommand ObjectXml_Update { get { return Data.GetCommand("ObjectXml_Update", ConnectionString.Method()); } }
            public static SqlCommand Parameter_Delete { get { return Data.GetCommand("Parameter_Delete", ConnectionString.Method()); } }
            public static SqlCommand Parameter_Get { get { return Data.GetCommand("Parameter_Get", ConnectionString.Method()); } }
            public static SqlCommand Parameter_Insert { get { return Data.GetCommand("Parameter_Insert", ConnectionString.Method()); } }
            public static SqlCommand Parameter_Update { get { return Data.GetCommand("Parameter_Update", ConnectionString.Method()); } }
            public static SqlCommand Procedure_Delete { get { return Data.GetCommand("Procedure_Delete", ConnectionString.Method()); } }
            public static SqlCommand Procedure_Get { get { return Data.GetCommand("Procedure_Get", ConnectionString.Method()); } }
            public static SqlCommand Procedure_Insert { get { return Data.GetCommand("Procedure_Insert", ConnectionString.Method()); } }
            public static SqlCommand Procedure_Update { get { return Data.GetCommand("Procedure_Update", ConnectionString.Method()); } }
            public static SqlCommand Project_Get { get { return Data.GetCommand("Project_Get", ConnectionString.Method()); } }
            public static SqlCommand Project_Insert { get { return Data.GetCommand("Project_Insert", ConnectionString.Method()); } }
            public static SqlCommand Project_Update { get { return Data.GetCommand("Project_Update", ConnectionString.Method()); } }
            public static SqlCommand ProjectProcedure_Delete { get { return Data.GetCommand("ProjectProcedure_Delete", ConnectionString.Method()); } }
            public static SqlCommand ProjectProcedure_Get { get { return Data.GetCommand("ProjectProcedure_Get", ConnectionString.Method()); } }
            public static SqlCommand ProjectProcedure_Insert { get { return Data.GetCommand("ProjectProcedure_Insert", ConnectionString.Method()); } }
            public static SqlCommand ProjectProcedure_Update { get { return Data.GetCommand("ProjectProcedure_Update", ConnectionString.Method()); } }
            public static SqlCommand sp_Tasks_Delete { get { return Data.GetCommand("sp_Tasks_Delete", ConnectionString.Method()); } }
            public static SqlCommand sp_Tasks_Get { get { return Data.GetCommand("sp_Tasks_Get", ConnectionString.Method()); } }
            public static SqlCommand sp_Tasks_Insert { get { return Data.GetCommand("sp_Tasks_Insert", ConnectionString.Method()); } }
            public static SqlCommand sp_tblUsers_DeleteByFirstName { get { return Data.GetCommand("sp_tblUsers_DeleteByFirstName", ConnectionString.Method()); } }
            public static SqlCommand sp_tblUsers_DeleteByLastName { get { return Data.GetCommand("sp_tblUsers_DeleteByLastName", ConnectionString.Method()); } }
            public static SqlCommand sp_tblUsers_Get { get { return Data.GetCommand("sp_tblUsers_Get", ConnectionString.Method()); } }
            public static SqlCommand sp_tblUsers_GetByUserID { get { return Data.GetCommand("sp_tblUsers_GetByUserID", ConnectionString.Method()); } }
            public static SqlCommand sp_tblUsers_Insert { get { return Data.GetCommand("sp_tblUsers_Insert", ConnectionString.Method()); } }
            public static SqlCommand Sprint_Get { get { return Data.GetCommand("Sprint_Get", ConnectionString.Method()); } }
            public static SqlCommand Sprint_Update { get { return Data.GetCommand("Sprint_Update", ConnectionString.Method()); } }
            public static SqlCommand Task_Get { get { return Data.GetCommand("Task_Get", ConnectionString.Method()); } }
            public static SqlCommand Task_Update { get { return Data.GetCommand("Task_Update", ConnectionString.Method()); } }
            public static SqlCommand xChat_Get { get { return Data.GetCommand("xChat_Get", ConnectionString.Method()); } }
            public static SqlCommand xChat_Insert { get { return Data.GetCommand("xChat_Insert", ConnectionString.Method()); } }
        }
    }

    public static class ConnectionString
    {
        public static string Method()
        {
            return Value;
        }
        private static string m_Value = null;
        public static string Value
        {
            get
            {
                string machine = System.Environment.MachineName.ToUpper();
                if (m_Value != null)
                {
                    return m_Value;
                }
                else
                {
                    switch (machine)
                    {
                        case DEFAULT:
                        default: return DEFAULTConnectionString;
                    }
                }
            }
            set { m_Value = value; }
        }

        public const string DEFAULT = "DEFAULT";
        public const string DEFAULTConnectionString = "Data Source=vdev001;Initial Catalog=IT;Integrated Security=True";
    }

}
