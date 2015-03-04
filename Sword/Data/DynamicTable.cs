using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;

namespace Sword
{
    public class DynamicTable
    {

        private string m_Schema = "dbo";
        public string Schema
        {
            get { return m_Schema; }
            set { m_Schema = value; }
        }

        private List<IDynamic> m_Rows = new List<IDynamic>();
        public virtual List<IDynamic> Rows
        {
            get { return m_Rows; }
            set { m_Rows = value; }
        }

        public void AddRow(string[] fields, params object[] objects)
        {
            var obj = new DynamicSword();
            for (int i = 0; i < objects.Length; i++)
            {
                if (i < fields.Length)
                {
                    obj[fields[i]] = objects[i];
                }
            }
            this.Rows.Add(obj);
        }

        public void AddRows(string[] fields, List<object[]> rows)
        {
            foreach (var objects in rows)
            {
                var obj = new DynamicSword();
                for (int i = 0; i < objects.Length; i++)
                {
                    if (i < fields.Length)
                    {
                        obj[fields[i]] = objects[i];
                    }
                }
                this.Rows.Add(obj);
            }
        }

        public string FullName()
        {
            return this.Schema + ".[" + Name + "]";
        }

        public DynamicTable(string name, Func<string> connectionMethod)
        {
            if (name.Contains("."))
            {
                var split = name.Split(new string[] { "." }, StringSplitOptions.None);
                this.Schema = split[0];
                _name = split[1];
            }
            else
            {
                _name = name;
            }
            _connectionMethod = connectionMethod;
        }

        public DynamicTable(string name, string connectionString)
        {
            if (name.Contains("."))
            {
                var split = name.Split(new string[] { "." }, StringSplitOptions.None);
                this.Schema = split[0];
                _name = split[1];
            }
            else
            {
                _name = name;
            }
            _connectionMethod = () =>
            {
                return connectionString;
            };
        }

        string _name;
        public string Name
        {
            get
            {
                return _name;
            }
        }

        Func<string> _connectionMethod;
        public string ConnectionString()
        {
            return _connectionMethod();
        }

        string identityCommandText()
        {
            return "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME ='" + this.Name + "' AND COLUMNPROPERTY(OBJECT_ID(TABLE_NAME), COLUMN_NAME,'IsIdentity') = 1";
        }
        string _identity = null;
        DateTime lastIdentityGrab = DateTime.MinValue;
        public string Identity()
        {

            if (lastIdentityGrab == DateTime.MinValue || DateTime.Now.Subtract(lastIdentityGrab).TotalHours > 12)
            {
                if (!string.IsNullOrEmpty(this.ConnectionString()) && !string.IsNullOrEmpty(this.Name))
                {
                    using (var conn = new SqlConnection(Data.ConnectionStringTimeout(Data.ConnectionStringTimeout(this.ConnectionString()))))
                    {
                        using (var cmd = new SqlCommand(identityCommandText(), conn))
                        {
                            try
                            {
                                conn.Open();
                                using (var reader = cmd.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        _identity = reader.GetString(0);
                                        break;
                                    }
                                }
                            }
                            catch (Exception)
                            {
                                throw;
                            }
                        }
                    }
                }
                lastIdentityGrab = DateTime.Now;
            }
            return _identity;
        }

        string pkCommandText()
        {
            return "select c.COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS c inner join " +
                "INFORMATION_SCHEMA.TABLES t on c.TABLE_NAME = t.TABLE_NAME inner join " +
                "INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc on tc.TABLE_NAME = t.TABLE_NAME inner join " +
                "INFORMATION_SCHEMA.KEY_COLUMN_USAGE as ku on tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME and ku.COLUMN_NAME = c.COLUMN_NAME " +
                "where tc.CONSTRAINT_TYPE ='PRIMARY KEY' and " +
                "t.TABLE_NAME ='" + this.Name + "'";
        }
        string[] _pk = null;
        DateTime lastPkGrab = DateTime.MinValue;
        public string[] PrimaryKeys()
        {
            if (lastPkGrab == DateTime.MinValue || DateTime.Now.Subtract(lastPkGrab).TotalHours > 12)
            {
                if (!string.IsNullOrEmpty(this.ConnectionString()) && !string.IsNullOrEmpty(this.Name))
                {

                    using (var conn = new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())))
                    {
                        using (var cmd = new SqlCommand(pkCommandText(), conn))
                        {
                            try
                            {
                                List<string> tempPK = new List<string>();
                                conn.Open();
                                using (var reader = cmd.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        tempPK.Add(reader.GetString(0));
                                    }
                                }
                                _pk = tempPK.ToArray();
                            }
                            catch (Exception)
                            {
                                throw;
                            }
                        }
                    }

                }
                lastPkGrab = DateTime.Now;
            }
            return _pk;
        }

        string rqCommandText()
        {
            return "select c.COLUMN_NAME TableField " +
                   "from INFORMATION_SCHEMA.COLUMNS c " +
                   "where " +
                   "c.IS_NULLABLE = 'NO' and " +
                   "c.TABLE_NAME = '" + this.Name + "'";
        }
        string[] _rQ = null;
        DateTime lastRqGrab = DateTime.MinValue;
        public string[] RequiredFields()
        {
            if (lastRqGrab == DateTime.Now || DateTime.Now.Subtract(lastRqGrab).TotalHours > 12)
            {
                if (!string.IsNullOrEmpty(this.ConnectionString()) && !string.IsNullOrEmpty(this.Name))
                {
                    using (var conn = new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())))
                    {
                        using (var cmd = new SqlCommand(rqCommandText(), conn))
                        {
                            try
                            {
                                List<string> tempRq = new List<string>();
                                conn.Open();
                                using (var reader = cmd.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        tempRq.Add(reader.GetString(0));
                                    }
                                }
                                _rQ = tempRq.ToArray();
                            }
                            catch (Exception)
                            {
                                throw;
                            }
                        }
                    }

                }
                lastRqGrab = DateTime.Now;
            }
            return _rQ;
        }

        string fieldsCommandText()
        {
            return "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '" + this.Name + "'";
        }
        string[] _fields = null;
        DateTime lastFieldsGrab = DateTime.MinValue;
        public string[] Fields()
        {
            if (lastFieldsGrab == DateTime.MinValue || DateTime.Now.Subtract(lastFieldsGrab).TotalHours > 12)
            {
                if (!string.IsNullOrEmpty(this.ConnectionString()) && !string.IsNullOrEmpty(this.Name))
                {

                    using (var conn = new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())))
                    {
                        using (var cmd = new SqlCommand(fieldsCommandText(), conn))
                        {
                            try
                            {
                                List<string> temp = new List<string>();
                                conn.Open();
                                using (var reader = cmd.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        temp.Add(reader.GetString(0));
                                    }
                                }
                                _fields = temp.ToArray();
                            }
                            catch (Exception)
                            {
                                throw;
                            }
                        }
                    }

                }
                lastFieldsGrab = DateTime.Now;
            }
            return _fields;
        }

        System.Data.SqlDbType getSqlDbType(string value)
        {
            if (value == "numeric")
            {
                return System.Data.SqlDbType.Decimal;
            }
            else
            {
                return (System.Data.SqlDbType)System.Enum.Parse(typeof(System.Data.SqlDbType), value, true);
            }
        }

        public List<DynamicSword> FieldDefinitions()
        {
            List<DynamicSword> fields = new List<DynamicSword>();
            if (lastFieldsGrab == DateTime.MinValue || DateTime.Now.Subtract(lastFieldsGrab).TotalHours > 12)
            {
                if (!string.IsNullOrEmpty(this.ConnectionString()) && !string.IsNullOrEmpty(this.Name))
                {

                    using (var conn = new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())))
                    {
                        var cmdText = "SELECT COLUMN_NAME AS TableName, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '" + this.Name + "'";
                        using (var cmd = new SqlCommand(cmdText, conn))
                        {
                            try
                            {
                                List<string> temp = new List<string>();
                                conn.Open();
                                using (var reader = cmd.ExecuteReader())
                                {
                                    while (reader.Read())
                                    {
                                        var obj = new DynamicSword();
                                        obj["TableName"] = reader.GetString(0);
                                        obj["SqlDbType"] = getSqlDbType(reader.GetString(1));
                                        fields.Add(obj);
                                    }
                                }
                                _fields = temp.ToArray();
                            }
                            catch (Exception)
                            {
                                throw;
                            }
                        }
                    }

                }
                lastFieldsGrab = DateTime.Now;
            }
            return fields;
        }


        public List<dynamic> Where(dynamic parameters)
        {
            List<dynamic> ret = new List<dynamic>();
            try
            {
                if (parameters is DynamicSword)
                {
                    ret = new List<dynamic> { this.ToList(parameters).ToArray() };
                }
            }
            catch (Exception)
            {
                throw;
            }
            return ret;
        }



        /// <summary>
        /// the object is the where clause 
        /// </summary>
        /// <param name="obj"></param>
        public void Delete(dynamic parameters)
        {
            parameters = Data.ToDynamicSword(parameters, this.Fields());
            if (parameters != null)
            {
                var properties = (string[])parameters.PropertyNames();
                if (properties.Length > 0)
                {
                    string deleteStatement = "DELETE FROM " + this.FullName() + " WHERE " +
                        (string.Join(" AND ", properties.Select(s => s + " = @" + s).ToArray()));
                    using (var conn = new System.Data.SqlClient.SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())))
                    {
                        using (var cmd = new System.Data.SqlClient.SqlCommand(deleteStatement, conn))
                        {
                            try
                            {
                                foreach (var item in properties)
                                {
                                    var parameter = new SqlParameter
                                    {
                                        ParameterName = "@" + item,
                                        Value = DBNull.Value
                                    };
                                    var value = parameters[item];
                                    if (value != null)
                                    {
                                        parameter.Value = value;
                                    }
                                    cmd.Parameters.Add(parameter);
                                }
                                cmd.CommandTimeout = Data.Timeout;
                                conn.Open();
                                cmd.ExecuteNonQuery();
                            }
                            catch (Exception)
                            {
                                throw;
                            }
                        }
                    }
                }
            }
        }

        public void BulkInsert(Func<dynamic, bool> where = null, int batchSize = 5000, Action<dynamic> preInsert = null)
        {
            if (this.Rows.Count > 0)
            {
                //prep a datatable
                var fieldArray = this.Fields();
                var identity = this.Identity();
                string tableName = this.Name;
                var table = new System.Data.DataTable();
                for (int i = 0; i < fieldArray.Length; i++)
                {
                    //if (string.IsNullOrEmpty(identity) || identity != fieldArray[i])
                    //{
                    table.Columns.Add(fieldArray[i]);
                    //}
                }

                if (preInsert != null)
                {
                    foreach (var item in this.Rows)
                    {
                        preInsert(item);
                        object[] row = new object[fieldArray.Length];
                        for (int i = 0; i < fieldArray.Length; i++)
                        {
                            row[i] = item[fieldArray[i]];
                        }
                        table.Rows.Add(row);
                    }
                }
                else
                {
                    foreach (var item in this.Rows)
                    {
                        bool add = true;
                        if (where != null)
                        {
                            add = where(item);
                        }
                        if (add)
                        {
                            object[] row = new object[fieldArray.Length];
                            for (int i = 0; i < fieldArray.Length; i++)
                            {
                                row[i] = item[fieldArray[i]];
                            }
                            table.Rows.Add(row);
                        }
                    }
                }

                var conn = new System.Data.SqlClient.SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString()));
                conn.Open();
                using (SqlTransaction transaction = conn.BeginTransaction())
                {
                    using (SqlBulkCopy bulkCopy = new SqlBulkCopy(conn, SqlBulkCopyOptions.Default, transaction))
                    {
                        bulkCopy.BulkCopyTimeout = Data.Timeout;
                        bulkCopy.BatchSize = batchSize;
                        if (tableName.IndexOf(".") == -1)
                        {
                            tableName = this.Schema + ".[" + tableName + "]";
                        }
                        bulkCopy.DestinationTableName = tableName;
                        try
                        {
                            bulkCopy.WriteToServer(table);
                            transaction.Commit();
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw ex;
                        }
                    }
                }
            }
        }

        public DynamicSword FirstOrDefault(dynamic parameters = null, params string[] fields)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            sb.Append("SELECT ");
            sb.Append((fields != null && fields.Length > 0 ? string.Join(", ", fields) + " " : "* "));
            sb.Append("FROM " + this.Schema + "." + this.Name + " ");
            string[] parameterNames = null;
            parameters = Data.ToDynamicSword(parameters, this.Fields());
            if (parameters != null)
            {
                parameterNames = parameters.PropertyNames();
                if (parameterNames != null &&
                    parameterNames.Length > 0)
                {
                    sb.Append("WHERE ");
                    sb.Append(string.Join(" AND ", parameterNames.Select(s => s + " = @" + s).ToArray()));

                }
            }
            var cmd = new SqlCommand(sb.ToString(), new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())));
            if (parameterNames != null)
            {
                cmd.Parameters.AddRange(parameterNames.Select(s => new SqlParameter { ParameterName = "@" + s, SourceColumn = s }).ToArray());
            }
            DynamicSword swordParameter = null;
            if (parameters is DynamicSword)
            {
                swordParameter = (DynamicSword)parameters;
            }

            return cmd.FirstOrDefault(swordParameter);
        }

        public T FirstOrDefault<T>(dynamic parameters = null, params string[] fields)
            where T : DynamicSword, new()
        {

            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            sb.Append("SELECT ");
            sb.Append((fields != null && fields.Length > 0 ? string.Join(", ", fields) + " " : "* "));
            sb.Append("FROM " + this.Schema + "." + this.Name + " ");
            string[] parameterNames = null;
            parameters = Data.ToDynamicSword(parameters, this.Fields());
            if (parameters != null)
            {
                parameterNames = parameters.PropertyNames();
                if (parameterNames != null &&
                    parameterNames.Length > 0)
                {
                    sb.Append("WHERE ");
                    sb.Append(string.Join(" AND ", parameterNames.Select(s => s + " = @" + s).ToArray()));

                }
            }
            var cmd = new SqlCommand(sb.ToString(), new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())));
            if (parameterNames != null)
            {
                cmd.Parameters.AddRange(parameterNames.Select(s => new SqlParameter { ParameterName = "@" + s, SourceColumn = s }).ToArray());
            }
            DynamicSword swordParameter = null;
            if (parameters is DynamicSword)
            {
                swordParameter = (DynamicSword)parameters;
            }
            return cmd.FirstOrDefault<T>(swordParameter);
        }

        public List<DynamicSword> ToList(dynamic parameters = null, params string[] fields)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            sb.Append("SELECT ");
            sb.Append((fields != null && fields.Length > 0 ? string.Join(", ", fields) + " " : "* "));
            sb.Append("FROM " + this.Schema + "." + this.Name + " ");
            string[] parameterNames = null;
            parameters = Data.ToDynamicSword(parameters, this.Fields());
            if (parameters != null)
            {

                parameterNames = parameters.PropertyNames();
                if (parameterNames != null &&
                    parameterNames.Length > 0)
                {
                    sb.Append("WHERE ");
                    sb.Append(string.Join(" AND ", parameterNames.Select(s => s + " = @" + s).ToArray()));

                }
            }
            var cmd = new SqlCommand(sb.ToString(), new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())));
            if (parameterNames != null)
            {
                cmd.Parameters.AddRange(parameterNames.Select(s => new SqlParameter { ParameterName = "@" + s, SourceColumn = s }).ToArray());
            }
            DynamicSword swordParameter = null;
            if (parameters is DynamicSword)
            {
                swordParameter = (DynamicSword)parameters;
            }
            return cmd.ToList(swordParameter);
        }

        public List<T> Top<T>(dynamic parameters, int top, params string[] fields)
            where T : class, IDynamic, new()
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            if (top > 0)
            {
                sb.Append("SELECT ");
                sb.Append("TOP(" + top.ToString() + ") ");
                sb.Append((fields != null && fields.Length > 0 ? string.Join(", ", fields) + " " : "* "));
                sb.Append("FROM " + this.Schema + "." + this.Name + " ");
                string[] parameterNames = null;
                parameters = Data.ToDynamicSword(parameters, this.Fields());
                if (parameters != null)
                {
                    parameterNames = parameters.PropertyNames();
                    if (parameterNames != null &&
                        parameterNames.Length > 0)
                    {
                        sb.Append("WHERE ");
                        sb.Append(string.Join(" AND ", parameterNames.Select(s => s + " = @" + s).ToArray()));

                    }
                }
                var cmd = new SqlCommand(sb.ToString(), new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())));
                if (parameterNames != null)
                {
                    cmd.Parameters.AddRange(parameterNames.Select(s => new SqlParameter { ParameterName = "@" + s, SourceColumn = s }).ToArray());
                }
                DynamicSword swordParameter = null;
                if (parameters is DynamicSword)
                {
                    swordParameter = (DynamicSword)parameters;
                }
                return Data.ToList<T>(cmd, swordParameter);
            }
            return new List<T>();
        }

        public List<T> Top<T>(dynamic parameters, int top = 50)
            where T : class, IDynamic, new()
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            if (top > 0)
            {
                sb.Append("SELECT ");
                sb.Append("TOP(" + top.ToString() + ") * ");
                sb.Append("FROM " + this.Schema + "." + this.Name + " ");
                string[] parameterNames = null;
                parameters = Data.ToDynamicSword(parameters, this.Fields());
                if (parameters != null)
                {
                    parameterNames = parameters.PropertyNames();
                    if (parameterNames != null &&
                        parameterNames.Length > 0)
                    {
                        sb.Append("WHERE ");
                        sb.Append(string.Join(" AND ", parameterNames.Select(s => s + " = @" + s).ToArray()));

                    }
                }
                var cmd = new SqlCommand(sb.ToString(), new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())));
                if (parameterNames != null)
                {
                    cmd.Parameters.AddRange(parameterNames.Select(s => new SqlParameter { ParameterName = "@" + s, SourceColumn = s }).ToArray());
                }
                DynamicSword swordParameter = null;
                if (parameters is DynamicSword)
                {
                    swordParameter = (DynamicSword)parameters;
                }
                return Data.ToList<T>(cmd, swordParameter);
            }
            return new List<T>();
        }


        public List<DynamicSword> Top(dynamic parameters, int top)
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            if (top > 0)
            {
                sb.Append("SELECT TOP(" + top.ToString() + ") * ");
                sb.Append("FROM " + this.Schema + "." + this.Name + " ");
                string[] parameterNames = null;
                parameters = Data.ToDynamicSword(parameters, this.Fields());
                if (parameters != null)
                {

                    parameterNames = parameters.PropertyNames();
                    if (parameterNames != null &&
                        parameterNames.Length > 0)
                    {
                        sb.Append("WHERE ");
                        sb.Append(string.Join(" AND ", parameterNames.Select(s => s + " = @" + s).ToArray()));

                    }
                }
                var cmd = new SqlCommand(sb.ToString(), new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())));
                if (parameterNames != null)
                {
                    cmd.Parameters.AddRange(parameterNames.Select(s => new SqlParameter { ParameterName = "@" + s, SourceColumn = s }).ToArray());
                }
                DynamicSword swordParameter = null;
                if (parameters is DynamicSword)
                {
                    swordParameter = (DynamicSword)parameters;
                }
                return cmd.ToList(swordParameter);
            }
            return new List<DynamicSword>();
        }

        public List<T> ToList<T>(dynamic parameters = null, params string[] fields)
            where T : class, IDynamic, new()
        {
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            sb.Append("SELECT ");
            sb.Append((fields != null && fields.Length > 0 ? string.Join(", ", fields) + " " : "* "));
            sb.Append("FROM " + this.Schema + "." + this.Name + " ");
            string[] parameterNames = null;
            parameters = Data.ToDynamicSword(parameters, this.Fields());
            if (parameters != null)
            {
                parameterNames = parameters.PropertyNames();
                if (parameterNames != null &&
                    parameterNames.Length > 0)
                {
                    sb.Append("WHERE ");
                    sb.Append(string.Join(" AND ", parameterNames.Select(s => s + " = @" + s).ToArray()));

                }
            }
            var cmd = new SqlCommand(sb.ToString(), new SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())));
            if (parameterNames != null)
            {
                cmd.Parameters.AddRange(parameterNames.Select(s => new SqlParameter { ParameterName = "@" + s, SourceColumn = s }).ToArray());
            }
            return Data.ToList<T>(cmd, parameters);
        }

        public void Update(dynamic obj)
        {
            obj = Data.ToDynamicSword(obj);
            List<System.Data.SqlClient.SqlParameter> parameters;
            string updateStatement = updateString(obj, obj.PropertyNames(), out parameters, this);
            if (parameters.Count > 1)
            {
                using (var conn = new System.Data.SqlClient.SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())))
                {
                    using (var cmd = new System.Data.SqlClient.SqlCommand(updateStatement, conn))
                    {
                        try
                        {
                            cmd.CommandTimeout = Data.Timeout;
                            conn.Open();
                            cmd.Parameters.AddRange(parameters.ToArray());
                            cmd.ExecuteNonQuery();
                        }
                        catch (Exception)
                        {
                            throw;
                        }
                    }
                }
            }
            else
            {
                throw new Exception("Missing Primary Keys, Identity column for update statement, or has no field that is being updated.");
            }
        }

        public void Insert(dynamic obj)
        {
            List<System.Data.SqlClient.SqlParameter> parameters;
            obj = Data.ToDynamicSword(obj);
            string insertStatement = insertString(obj, obj.PropertyNames(), out parameters, this);
            if (parameters.Count > 1)
            {
                using (var conn = new System.Data.SqlClient.SqlConnection(Data.ConnectionStringTimeout(this.ConnectionString())))
                {
                    using (var cmd = new System.Data.SqlClient.SqlCommand(insertStatement, conn))
                    {
                        try
                        {
                            cmd.CommandTimeout = Data.Timeout;
                            conn.Open();
                            cmd.Parameters.AddRange(parameters.ToArray());
                            cmd.ExecuteNonQuery();
                            Data.setOutputParameters(obj, cmd);
                        }
                        catch (Exception)
                        {
                            throw;
                        }
                    }
                }
            }
            else
            {
                throw new Exception("Missing Primary Keys, Identity column for update statement, or has no field that is being updated.");
            }
        }

        public void Insert(List<dynamic> obj)
        {
            List<System.Data.SqlClient.SqlParameter> parameters;
            string insertStatement = insertString(obj[0], obj[0].PropertyNames(), out parameters, this);
            if (parameters.Count > 1)
            {
                using (var conn = new System.Data.SqlClient.SqlConnection(this.ConnectionString()))
                {
                    using (var cmd = new System.Data.SqlClient.SqlCommand(insertStatement, conn))
                    {
                        try
                        {
                            cmd.CommandTimeout = Data.Timeout;
                            conn.Open();
                            cmd.Parameters.AddRange(parameters.ToArray());
                            foreach (var item in obj)
                            {
                                Data.setParameter(item, cmd);
                                cmd.ExecuteNonQuery();
                            }
                        }
                        catch (Exception)
                        {
                            throw;
                        }
                    }
                }
            }
            else
            {
                throw new Exception("Missing Primary Keys, Identity column for update statement, or has no field that is being updated.");
            }
        }

        internal static string insertString(IDynamic obj, string[] props, out List<System.Data.SqlClient.SqlParameter> parameters, DynamicTable table)
        {
            //need to make sure that one have the identity for the item 
            //or two the pks are there for the update  
            var identity = table.Identity();
            parameters = new List<SqlParameter>();
            List<string> updateFields = new List<string>();
            string[] tableFields = table.Fields();
            string updateStatement = "INSERT INTO " + table.Name + " (";
            if (!string.IsNullOrEmpty(identity) && props.Length > 1)
            {
                foreach (var item in props)
                {
                    if (item != identity && tableFields.Contains(item))
                    {
                        updateFields.Add(item);
                        parameters.Add(Data.getParameter(item, obj[item]));
                    }
                }
            }
            else
            {
                foreach (var item in props)
                {
                    if (tableFields.Contains(item))
                    {
                        updateFields.Add(item);
                        parameters.Add(Data.getParameter(item, obj[item]));
                    }
                }

            }
            updateStatement += string.Join(", ", updateFields) + ") VALUES (" +
                    string.Join(", ", updateFields.Select(s => "@" + s).ToArray()) + ")";
            if (!string.IsNullOrEmpty(identity))
            {
                parameters.Add(new SqlParameter
                {
                    ParameterName = "@" + identity,
                    Direction = ParameterDirection.Output,
                    SqlDbType = SqlDbType.Int
                });
                updateStatement += ";\r\nSET @" + identity + " = SCOPE_IDENTITY();";
            }
            return updateStatement;
        }

        internal static string updateString(IDynamic obj, string[] props, out List<System.Data.SqlClient.SqlParameter> parameters, DynamicTable table)
        {
            //need to make sure that one have the identity for the item 
            //or two the pks are there for the update  
            var identity = table.Identity();
            parameters = new List<SqlParameter>();
            List<string> updateFields = new List<string>();
            string[] tableFields = table.Fields();
            string updateStatement = "UPDATE " + table.Name + " SET ";
            if (!string.IsNullOrEmpty(identity) && obj[identity] != null && props.Length > 1)
            {
                foreach (var item in props)
                {
                    if (item != identity && tableFields.Contains(item))
                    {
                        updateFields.Add(item);
                        parameters.Add(Data.getParameter(item, obj[item]));
                    }
                }
                updateStatement += string.Join(", ", updateFields.Select(o => o + "= @" + o).ToArray());
                updateStatement += " WHERE " + identity + " = @" + identity;
                parameters.Add(new SqlParameter
                {
                    ParameterName = "@" + identity,
                    Value = obj[identity]
                });
            }
            else
            {
                var pks = table.PrimaryKeys();
                if (pks != null && pks.Length > 0)
                {
                    var hasPk = true;
                    foreach (var pk in pks)
                    {
                        if (obj[pk] == null)
                        {
                            hasPk = false;
                            break;
                        }
                    }
                    if (hasPk)
                    {
                        foreach (var item in props)
                        {
                            if (pks.FirstOrDefault(i => i == item) == null && tableFields.Contains(item))
                            {
                                updateFields.Add(item);
                                parameters.Add(Data.getParameter(item, obj[item]));
                            }
                        }
                        updateStatement += string.Join(", ", updateFields.Select(o => o + "= @" + o).ToArray());
                        updateStatement += " WHERE ";
                        updateFields.Clear();
                        foreach (var item in pks)
                        {
                            updateFields.Add(item);
                            parameters.Add(Data.getParameter(item, obj[item]));
                        }
                        updateStatement += string.Join(" AND ", updateFields.Select(o => o + " = @" + o).ToArray());
                    }
                }
            }
            return updateStatement;
        }

    }

    //turn it on its head?  have DynamicTable inherit an abstract?
    //public class DynamicTable<rowType> : DynamicTable
    //    where rowType : class, new()
    //{
    //    public DynamicTable(string name, Func<string> connectionMethod) : base(name, connectionMethod) { }
    //    public List<rowType> Where(Expression<Func<rowType, bool>> clause)    
    //    {
    //        List<rowType> ret = new List<rowType>();
    //        try
    //        {
    //            var table = this.Name;
    //            string sWhere = Data.prepWhere(clause);
    //            if (!string.IsNullOrEmpty(sWhere))
    //            {
    //                var connString = this.ConnectionString();
    //                if (!string.IsNullOrEmpty(table) && !string.IsNullOrEmpty(connString))
    //                {
    //                    using (SqlConnection conn = new SqlConnection(connString))
    //                    {
    //                        using (SqlCommand cmd = new SqlCommand("SELECT * FROM " + table + sWhere, conn))
    //                        {
    //                            conn.Open();
    //                            using (var reader = cmd.ExecuteReader())
    //                            {
    //                                Dictionary<string, MapPoint> staticallyTypedMap;
    //                                Dictionary<string, MapPoint> dynamicallyTypedMap;
    //                                //just bumped up against reflection here=>
    //                                //Data.setMaps(new rowType(), reader, out staticallyTypedMap, out dynamicallyTypedMap);
    //                                while (reader.Read())
    //                                {
    //                                    var newObj = new rowType();
    //                                    Data.SetAsLoading(newObj);
    //                                    newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
    //                                    ret.Add(newObj);
    //                                }
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //        catch (Exception)
    //        {
    //            throw;
    //        }
    //        return ret;
    //    }
    //}
}
