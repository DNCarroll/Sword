using System;
using Sword;
using System.Linq;
using System.Collections.Generic;
using System.Data.SqlClient;
using Newtonsoft.Json;
namespace Sword.Objects
{
    [JsonObject(MemberSerialization.OptOut)]
    public partial class Connection : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int ConnectionID { get; set; }
        public string Name { get; set; }
        public string ConnectionStringValue { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "ConnectionID": return this.ConnectionID;
                case "Name": return this.Name;
                case "ConnectionStringValue": return this.ConnectionStringValue;
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
                case "ConnectionStringValue": this.ConnectionStringValue = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.ConnectionID = Setters.Int(reader, map["ConnectionID"], ConnectionID);
            this.Name = Setters.String(reader, map["Name"], Name);
            this.ConnectionStringValue = Setters.String(reader, map["ConnectionStringValue"], ConnectionStringValue);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.ConnectionID = Setters.Int(values, map["ConnectionID"], ConnectionID);
            this.Name = Setters.String(values, map["Name"], Name);
            this.ConnectionStringValue = Setters.String(values, map["ConnectionStringValue"], ConnectionStringValue);
        }
        public override string[] SerializableProperties() { return new string[] { "ConnectionID", "Name", "ConnectionStringValue" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "ConnectionID", "Name", "ConnectionStringValue" }; }
        
        
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        
        
        [JsonIgnore]
        public override string Table { get { return "Connections"; } }
        
        
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
        
        
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        
        
        [JsonIgnore]
        public override string Table { get { return "ConnectionStrings"; } }
        
        
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

        public int EnumID { get; set; }
        public string Name { get; set; }
        public bool HasFlags { get; set; }
        public int ConnectionID { get; set; }
        public string TableName { get; set; }
        public string ValueColumn { get; set; }
        public string DisplayColumn { get; set; }
        public bool IncludeNoneValue { get; set; }
        public string FilterColumn { get; set; }
        public string FilterValue { get; set; }
        public int ProjectID { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "EnumID": return this.EnumID;
                case "Name": return this.Name;
                case "HasFlags": return this.HasFlags;
                case "ConnectionID": return this.ConnectionID;
                case "TableName": return this.TableName;
                case "ValueColumn": return this.ValueColumn;
                case "DisplayColumn": return this.DisplayColumn;
                case "IncludeNoneValue": return this.IncludeNoneValue;
                case "FilterColumn": return this.FilterColumn;
                case "FilterValue": return this.FilterValue;
                case "ProjectID": return this.ProjectID;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "EnumID": this.EnumID = Setters.Int(value); break;
                case "Name": this.Name = Setters.String(value); break;
                case "HasFlags": this.HasFlags = Setters.Bool(value); break;
                case "ConnectionID": this.ConnectionID = Setters.Int(value); break;
                case "TableName": this.TableName = Setters.String(value); break;
                case "ValueColumn": this.ValueColumn = Setters.String(value); break;
                case "DisplayColumn": this.DisplayColumn = Setters.String(value); break;
                case "IncludeNoneValue": this.IncludeNoneValue = Setters.Bool(value); break;
                case "FilterColumn": this.FilterColumn = Setters.String(value); break;
                case "FilterValue": this.FilterValue = Setters.String(value); break;
                case "ProjectID": this.ProjectID = Setters.Int(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.EnumID = Setters.Int(reader, map["EnumID"], EnumID);
            this.Name = Setters.String(reader, map["Name"], Name);
            this.HasFlags = Setters.Bool(reader, map["HasFlags"], HasFlags);
            this.ConnectionID = Setters.Int(reader, map["ConnectionID"], ConnectionID);
            this.TableName = Setters.String(reader, map["TableName"], TableName);
            this.ValueColumn = Setters.String(reader, map["ValueColumn"], ValueColumn);
            this.DisplayColumn = Setters.String(reader, map["DisplayColumn"], DisplayColumn);
            this.IncludeNoneValue = Setters.Bool(reader, map["IncludeNoneValue"], IncludeNoneValue);
            this.FilterColumn = Setters.String(reader, map["FilterColumn"], FilterColumn);
            this.FilterValue = Setters.String(reader, map["FilterValue"], FilterValue);
            this.ProjectID = Setters.Int(reader, map["ProjectID"], ProjectID);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.EnumID = Setters.Int(values, map["EnumID"], EnumID);
            this.Name = Setters.String(values, map["Name"], Name);
            this.HasFlags = Setters.Bool(values, map["HasFlags"], HasFlags);
            this.ConnectionID = Setters.Int(values, map["ConnectionID"], ConnectionID);
            this.TableName = Setters.String(values, map["TableName"], TableName);
            this.ValueColumn = Setters.String(values, map["ValueColumn"], ValueColumn);
            this.DisplayColumn = Setters.String(values, map["DisplayColumn"], DisplayColumn);
            this.IncludeNoneValue = Setters.Bool(values, map["IncludeNoneValue"], IncludeNoneValue);
            this.FilterColumn = Setters.String(values, map["FilterColumn"], FilterColumn);
            this.FilterValue = Setters.String(values, map["FilterValue"], FilterValue);
            this.ProjectID = Setters.Int(values, map["ProjectID"], ProjectID);
        }
        public override string[] SerializableProperties() { return new string[] { "EnumID", "Name", "HasFlags", "ConnectionID", "TableName", "ValueColumn", "DisplayColumn", "IncludeNoneValue", "FilterColumn", "FilterValue", "ProjectID" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "EnumID", "Name", "HasFlags", "ConnectionID", "TableName", "ValueColumn", "DisplayColumn", "IncludeNoneValue", "FilterColumn", "FilterValue", "ProjectID" }; }
        
        
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        
        
        [JsonIgnore]
        public override string Table { get { return "Enums"; } }
        
        
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "EnumID", "Name", "HasFlags", "ConnectionID", "TableName", "ValueColumn", "DisplayColumn", "IncludeNoneValue", "FilterColumn", "FilterValue", "ProjectID" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class Field : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int FieldID { get; set; }
        public int ObjectID { get; set; }
        public string TableName { get; set; }
        public bool Include { get; set; }
        public bool JsonSerializable { get; set; }
        public bool XmlSerializable { get; set; }
        public int SqlDbType { get; set; }
        public string UDT { get; set; }
        public string GetMethod { get; set; }
        public string SetMethod { get; set; }
        public bool IsReadOnly { get; set; }
        public string Aliases { get; set; }
        public string PropertyName { get; set; }
        public bool UseChangeEvent { get; set; }
        public string DefaultValue { get; set; }
        public bool IsEnum { get; set; }
        public bool IncludeInSetValue { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "FieldID": return this.FieldID;
                case "ObjectID": return this.ObjectID;
                case "TableName": return this.TableName;
                case "Include": return this.Include;
                case "JsonSerializable": return this.JsonSerializable;
                case "XmlSerializable": return this.XmlSerializable;
                case "SqlDbType": return this.SqlDbType;
                case "UDT": return this.UDT;
                case "GetMethod": return this.GetMethod;
                case "SetMethod": return this.SetMethod;
                case "IsReadOnly": return this.IsReadOnly;
                case "Aliases": return this.Aliases;
                case "PropertyName": return this.PropertyName;
                case "UseChangeEvent": return this.UseChangeEvent;
                case "DefaultValue": return this.DefaultValue;
                case "IsEnum": return this.IsEnum;
                case "IncludeInSetValue": return this.IncludeInSetValue;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "FieldID": this.FieldID = Setters.Int(value); break;
                case "ObjectID": this.ObjectID = Setters.Int(value); break;
                case "TableName": this.TableName = Setters.String(value); break;
                case "Include": this.Include = Setters.Bool(value); break;
                case "JsonSerializable": this.JsonSerializable = Setters.Bool(value); break;
                case "XmlSerializable": this.XmlSerializable = Setters.Bool(value); break;
                case "SqlDbType": this.SqlDbType = Setters.Int(value); break;
                case "UDT": this.UDT = Setters.String(value); break;
                case "GetMethod": this.GetMethod = Setters.String(value); break;
                case "SetMethod": this.SetMethod = Setters.String(value); break;
                case "IsReadOnly": this.IsReadOnly = Setters.Bool(value); break;
                case "Aliases": this.Aliases = Setters.String(value); break;
                case "PropertyName": this.PropertyName = Setters.String(value); break;
                case "UseChangeEvent": this.UseChangeEvent = Setters.Bool(value); break;
                case "DefaultValue": this.DefaultValue = Setters.String(value); break;
                case "IsEnum": this.IsEnum = Setters.Bool(value); break;
                case "IncludeInSetValue": this.IncludeInSetValue = Setters.Bool(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.FieldID = Setters.Int(reader, map["FieldID"], FieldID);
            this.ObjectID = Setters.Int(reader, map["ObjectID"], ObjectID);
            this.TableName = Setters.String(reader, map["TableName"], TableName);
            this.Include = Setters.Bool(reader, map["Include"], Include);
            this.JsonSerializable = Setters.Bool(reader, map["JsonSerializable"], JsonSerializable);
            this.XmlSerializable = Setters.Bool(reader, map["XmlSerializable"], XmlSerializable);
            this.SqlDbType = Setters.Int(reader, map["SqlDbType"], SqlDbType);
            this.UDT = Setters.String(reader, map["UDT"], UDT);
            this.GetMethod = Setters.String(reader, map["GetMethod"], GetMethod);
            this.SetMethod = Setters.String(reader, map["SetMethod"], SetMethod);
            this.IsReadOnly = Setters.Bool(reader, map["IsReadOnly"], IsReadOnly);
            this.Aliases = Setters.String(reader, map["Aliases"], Aliases);
            this.PropertyName = Setters.String(reader, map["PropertyName"], PropertyName);
            this.UseChangeEvent = Setters.Bool(reader, map["UseChangeEvent"], UseChangeEvent);
            this.DefaultValue = Setters.String(reader, map["DefaultValue"], DefaultValue);
            this.IsEnum = Setters.Bool(reader, map["IsEnum"], IsEnum);
            this.IncludeInSetValue = Setters.Bool(reader, map["IncludeInSetValue"], IncludeInSetValue);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.FieldID = Setters.Int(values, map["FieldID"], FieldID);
            this.ObjectID = Setters.Int(values, map["ObjectID"], ObjectID);
            this.TableName = Setters.String(values, map["TableName"], TableName);
            this.Include = Setters.Bool(values, map["Include"], Include);
            this.JsonSerializable = Setters.Bool(values, map["JsonSerializable"], JsonSerializable);
            this.XmlSerializable = Setters.Bool(values, map["XmlSerializable"], XmlSerializable);
            this.SqlDbType = Setters.Int(values, map["SqlDbType"], SqlDbType);
            this.UDT = Setters.String(values, map["UDT"], UDT);
            this.GetMethod = Setters.String(values, map["GetMethod"], GetMethod);
            this.SetMethod = Setters.String(values, map["SetMethod"], SetMethod);
            this.IsReadOnly = Setters.Bool(values, map["IsReadOnly"], IsReadOnly);
            this.Aliases = Setters.String(values, map["Aliases"], Aliases);
            this.PropertyName = Setters.String(values, map["PropertyName"], PropertyName);
            this.UseChangeEvent = Setters.Bool(values, map["UseChangeEvent"], UseChangeEvent);
            this.DefaultValue = Setters.String(values, map["DefaultValue"], DefaultValue);
            this.IsEnum = Setters.Bool(values, map["IsEnum"], IsEnum);
            this.IncludeInSetValue = Setters.Bool(values, map["IncludeInSetValue"], IncludeInSetValue);
        }
        public override string[] SerializableProperties() { return new string[] { "FieldID", "ObjectID", "TableName", "Include", "JsonSerializable", "XmlSerializable", "SqlDbType", "UDT", "GetMethod", "SetMethod", "IsReadOnly", "Aliases", "PropertyName", "UseChangeEvent", "DefaultValue", "IsEnum", "IncludeInSetValue" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "FieldID", "ObjectID", "TableName", "Include", "JsonSerializable", "XmlSerializable", "SqlDbType", "UDT", "GetMethod", "SetMethod", "IsReadOnly", "Aliases", "PropertyName", "UseChangeEvent", "DefaultValue", "IsEnum", "IncludeInSetValue" }; }
        
        
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        
        
        [JsonIgnore]
        public override string Table { get { return "Fields"; } }
        
        
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "FieldID", "ObjectID", "TableName", "Include", "JsonSerializable", "XmlSerializable", "SqlDbType", "UDT", "GetMethod", "SetMethod", "IsReadOnly", "Aliases", "PropertyName", "UseChangeEvent", "DefaultValue", "IsEnum", "IncludeInSetValue" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class Item : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int ObjectID { get; set; }
        public string ClassName { get; set; }
        public string TableName { get; set; }
        public int ConnectionID { get; set; }
        public int ProjectID { get; set; }
        public string Target { get; set; }
        public bool UseObjectState { get; set; }
        public bool UseChangeEvent { get; set; }
        public string UserCode { get; set; }
        public string Namespace { get; set; }
        public bool IsPartial { get; set; }
        public string PK { get; set; }
        public string DefaultConnectionString { get; set; }
        public bool AllowDeletes { get; set; }
        public bool AllowInserts { get; set; }
        public string ScopeID { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "ObjectID": return this.ObjectID;
                case "ClassName": return this.ClassName;
                case "TableName": return this.TableName;
                case "ConnectionID": return this.ConnectionID;
                case "ProjectID": return this.ProjectID;
                case "Target": return this.Target;
                case "UseObjectState": return this.UseObjectState;
                case "UseChangeEvent": return this.UseChangeEvent;
                case "UserCode": return this.UserCode;
                case "Namespace": return this.Namespace;
                case "IsPartial": return this.IsPartial;
                case "PK": return this.PK;
                case "DefaultConnectionString": return this.DefaultConnectionString;
                case "AllowDeletes": return this.AllowDeletes;
                case "AllowInserts": return this.AllowInserts;
                case "ScopeID": return this.ScopeID;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "ObjectID": this.ObjectID = Setters.Int(value); break;
                case "ClassName": this.ClassName = Setters.String(value); break;
                case "TableName": this.TableName = Setters.String(value); break;
                case "ConnectionID": this.ConnectionID = Setters.Int(value); break;
                case "ProjectID": this.ProjectID = Setters.Int(value); break;
                case "Target": this.Target = Setters.String(value); break;
                case "UseObjectState": this.UseObjectState = Setters.Bool(value); break;
                case "UseChangeEvent": this.UseChangeEvent = Setters.Bool(value); break;
                case "UserCode": this.UserCode = Setters.String(value); break;
                case "Namespace": this.Namespace = Setters.String(value); break;
                case "IsPartial": this.IsPartial = Setters.Bool(value); break;
                case "PK": this.PK = Setters.String(value); break;
                case "DefaultConnectionString": this.DefaultConnectionString = Setters.String(value); break;
                case "AllowDeletes": this.AllowDeletes = Setters.Bool(value); break;
                case "AllowInserts": this.AllowInserts = Setters.Bool(value); break;
                case "ScopeID": this.ScopeID = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.ObjectID = Setters.Int(reader, map["ObjectID"], ObjectID);
            this.ClassName = Setters.String(reader, map["ClassName"], ClassName);
            this.TableName = Setters.String(reader, map["TableName"], TableName);
            this.ConnectionID = Setters.Int(reader, map["ConnectionID"], ConnectionID);
            this.ProjectID = Setters.Int(reader, map["ProjectID"], ProjectID);
            this.Target = Setters.String(reader, map["Target"], Target);
            this.UseObjectState = Setters.Bool(reader, map["UseObjectState"], UseObjectState);
            this.UseChangeEvent = Setters.Bool(reader, map["UseChangeEvent"], UseChangeEvent);
            this.UserCode = Setters.String(reader, map["UserCode"], UserCode);
            this.Namespace = Setters.String(reader, map["Namespace"], Namespace);
            this.IsPartial = Setters.Bool(reader, map["IsPartial"], IsPartial);
            this.PK = Setters.String(reader, map["PK"], PK);
            this.DefaultConnectionString = Setters.String(reader, map["DefaultConnectionString"], DefaultConnectionString);
            this.AllowDeletes = Setters.Bool(reader, map["AllowDeletes"], AllowDeletes);
            this.AllowInserts = Setters.Bool(reader, map["AllowInserts"], AllowInserts);
            this.ScopeID = Setters.String(reader, map["ScopeID"], ScopeID);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.ObjectID = Setters.Int(values, map["ObjectID"], ObjectID);
            this.ClassName = Setters.String(values, map["ClassName"], ClassName);
            this.TableName = Setters.String(values, map["TableName"], TableName);
            this.ConnectionID = Setters.Int(values, map["ConnectionID"], ConnectionID);
            this.ProjectID = Setters.Int(values, map["ProjectID"], ProjectID);
            this.Target = Setters.String(values, map["Target"], Target);
            this.UseObjectState = Setters.Bool(values, map["UseObjectState"], UseObjectState);
            this.UseChangeEvent = Setters.Bool(values, map["UseChangeEvent"], UseChangeEvent);
            this.UserCode = Setters.String(values, map["UserCode"], UserCode);
            this.Namespace = Setters.String(values, map["Namespace"], Namespace);
            this.IsPartial = Setters.Bool(values, map["IsPartial"], IsPartial);
            this.PK = Setters.String(values, map["PK"], PK);
            this.DefaultConnectionString = Setters.String(values, map["DefaultConnectionString"], DefaultConnectionString);
            this.AllowDeletes = Setters.Bool(values, map["AllowDeletes"], AllowDeletes);
            this.AllowInserts = Setters.Bool(values, map["AllowInserts"], AllowInserts);
            this.ScopeID = Setters.String(values, map["ScopeID"], ScopeID);
        }
        public override string[] SerializableProperties() { return new string[] { "ObjectID", "ClassName", "TableName", "ConnectionID", "ProjectID", "Target", "UseObjectState", "UseChangeEvent", "UserCode", "Namespace", "IsPartial", "PK", "DefaultConnectionString", "AllowDeletes", "AllowInserts", "ScopeID" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "ObjectID", "ClassName", "TableName", "ConnectionID", "ProjectID", "Target", "UseObjectState", "UseChangeEvent", "UserCode", "Namespace", "IsPartial", "PK", "DefaultConnectionString", "AllowDeletes", "AllowInserts", "ScopeID" }; }
        
        
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        
        
        [JsonIgnore]
        public override string Table { get { return "Objects"; } }
        
        
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "ObjectID", "ClassName", "TableName", "ConnectionID", "ProjectID", "Target", "UseObjectState", "UseChangeEvent", "UserCode", "Namespace", "IsPartial", "PK", "DefaultConnectionString", "AllowDeletes", "AllowInserts", "ScopeID" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class Parameters : DynamicSword
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
        
        
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        
        
        [JsonIgnore]
        public override string Table { get { return "Parameters"; } }
        
        
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "ParameterID", "ProcedureID", "Scale", "SqlDbType", "Precision", "Size", "Direction", "DefaultValue", "Name", "SourceColumn" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class Project : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int ProjectID { get; set; }
        public string Name { get; set; }
        public string BuildPath { get; set; }
        public string PublishPath { get; set; }
        public string Namespace { get; set; }
        public string DefaultConnectionString { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "ProjectID": return this.ProjectID;
                case "Name": return this.Name;
                case "BuildPath": return this.BuildPath;
                case "PublishPath": return this.PublishPath;
                case "Namespace": return this.Namespace;
                case "DefaultConnectionString": return this.DefaultConnectionString;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "ProjectID": this.ProjectID = Setters.Int(value); break;
                case "Name": this.Name = Setters.String(value); break;
                case "BuildPath": this.BuildPath = Setters.String(value); break;
                case "PublishPath": this.PublishPath = Setters.String(value); break;
                case "Namespace": this.Namespace = Setters.String(value); break;
                case "DefaultConnectionString": this.DefaultConnectionString = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.ProjectID = Setters.Int(reader, map["ProjectID"], ProjectID);
            this.Name = Setters.String(reader, map["Name"], Name);
            this.BuildPath = Setters.String(reader, map["BuildPath"], BuildPath);
            this.PublishPath = Setters.String(reader, map["PublishPath"], PublishPath);
            this.Namespace = Setters.String(reader, map["Namespace"], Namespace);
            this.DefaultConnectionString = Setters.String(reader, map["DefaultConnectionString"], DefaultConnectionString);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.ProjectID = Setters.Int(values, map["ProjectID"], ProjectID);
            this.Name = Setters.String(values, map["Name"], Name);
            this.BuildPath = Setters.String(values, map["BuildPath"], BuildPath);
            this.PublishPath = Setters.String(values, map["PublishPath"], PublishPath);
            this.Namespace = Setters.String(values, map["Namespace"], Namespace);
            this.DefaultConnectionString = Setters.String(values, map["DefaultConnectionString"], DefaultConnectionString);
        }
        public override string[] SerializableProperties() { return new string[] { "ProjectID", "Name", "BuildPath", "PublishPath", "Namespace", "DefaultConnectionString" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "ProjectID", "Name", "BuildPath", "PublishPath", "Namespace", "DefaultConnectionString" }; }
        
        
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        
        
        [JsonIgnore]
        public override string Table { get { return "Projects"; } }
        
        
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "ProjectID", "Name", "BuildPath", "PublishPath", "Namespace", "DefaultConnectionString" }; }
        #endregion

        #endregion

    }

    [JsonObject(MemberSerialization.OptOut)]
    public partial class ProjectProcedure : DynamicSword
    {
        #region Sword Code

        #region Properties

        public int ProjectProcedureID { get; set; }
        public int ProjectID { get; set; }
        public string CommandText { get; set; }
        public string Alias { get; set; }
        public string Wrapper { get; set; }
        #endregion

        #region ISword
        public override object GetValue(string propertyName)
        {
            switch (propertyName)
            {
                case "ProjectProcedureID": return this.ProjectProcedureID;
                case "ProjectID": return this.ProjectID;
                case "CommandText": return this.CommandText;
                case "Alias": return this.Alias;
                case "Wrapper": return this.Wrapper;
                default:
                    return null;
            }
        }

        public override void SetValue(string propertyName, object value)
        {
            switch (propertyName)
            {
                case "ProjectProcedureID": this.ProjectProcedureID = Setters.Int(value); break;
                case "ProjectID": this.ProjectID = Setters.Int(value); break;
                case "CommandText": this.CommandText = Setters.String(value); break;
                case "Alias": this.Alias = Setters.String(value); break;
                case "Wrapper": this.Wrapper = Setters.String(value); break;
                default:
                    break;
            }
        }

        public override void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map)
        {
            this.ProjectProcedureID = Setters.Int(reader, map["ProjectProcedureID"], ProjectProcedureID);
            this.ProjectID = Setters.Int(reader, map["ProjectID"], ProjectID);
            this.CommandText = Setters.String(reader, map["CommandText"], CommandText);
            this.Alias = Setters.String(reader, map["Alias"], Alias);
            this.Wrapper = Setters.String(reader, map["Wrapper"], Wrapper);
        }
        public override void SetValues(object[] values, Dictionary<string, MapPoint> map)
        {
            this.ProjectProcedureID = Setters.Int(values, map["ProjectProcedureID"], ProjectProcedureID);
            this.ProjectID = Setters.Int(values, map["ProjectID"], ProjectID);
            this.CommandText = Setters.String(values, map["CommandText"], CommandText);
            this.Alias = Setters.String(values, map["Alias"], Alias);
            this.Wrapper = Setters.String(values, map["Wrapper"], Wrapper);
        }
        public override string[] SerializableProperties() { return new string[] { "ProjectProcedureID", "ProjectID", "CommandText", "Alias", "Wrapper" }; }
        public override string[] GetStaticallyTypedPropertyNames() { return new string[] { "ProjectProcedureID", "ProjectID", "CommandText", "Alias", "Wrapper" }; }
        
        
        [JsonIgnore]
        public string[] PrimaryKeys { get { return null; } }
        
        
        [JsonIgnore]
        public override string Table { get { return "ProjectProcedures"; } }
        
        
        [JsonIgnore]
        public override string ObjectConnectionString { get { return ConnectionString.Method(); } }
        public override string[] TableFields() { return new string[] { "ProjectProcedureID", "ProjectID", "CommandText", "Alias", "Wrapper" }; }
        #endregion

        #endregion

    }

    public static class Tables
    {
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
        }
    }
    public static class Dbo
    {
        public static class Procs
        {
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
        public const string DEFAULTConnectionString = "Data Source=VDEV001;Initial Catalog=tempSword;Integrated Security=True";
    }

}
