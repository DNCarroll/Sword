using System;
using System.Collections.Generic;
using System.Linq;
using d = System.Data;
using System.Dynamic;
using System.Collections.ObjectModel;
using System.Linq.Expressions;
using System.ComponentModel;
using System.Threading.Tasks;

namespace Sword
{

	public delegate bool parseDelegate<T>(string value, out T target);
	public static class Data
	{


		private static bool m_CacheProcedureInfo = true;
		public static bool CacheProcedureInfo
		{
			get { return m_CacheProcedureInfo; }
			set { m_CacheProcedureInfo = value; }
		}


		private static bool m_CoerceParameterTypes = false;
		public static bool UseParameterCast
		{
			get { return m_CoerceParameterTypes; }
			set
			{
				m_CoerceParameterTypes = value;
				if (value)
				{
					_setParameter = setByCast;
				}
				else
				{
					_setParameter = setByStatic;
				}
			}
		}

        #region Regular Expression and Sql Command
        
        public static bool TrySetSqlCommandParameterValues(this System.Text.RegularExpressions.Regex regex,
            string source,
            d.IDbCommand command,
            Func<string, object> regexNotFoundOrValueIsNull)
        {
            var match = regex.Match(source);
            if (match.Success)
            {
                foreach (d.IDbDataParameter item in command.Parameters)
                {
                    item.Value = DBNull.Value;
                    var group = match.Groups[item.SourceColumn];
                    //if (group != null || group.Value == null)
                    //{
                    if (group != null &&
                        !string.IsNullOrEmpty(group.Value))
                    {
                        item.Value = group.Value.Trim();
                    }
                    else if (regexNotFoundOrValueIsNull != null)
                    {
                        var value = regexNotFoundOrValueIsNull(item.SourceColumn);
                        if (value != null)
                        {
                            item.Value = value;
                        }
                    }
                    //}
                    //else if (notFoundInRegexGroups != null)
                    //{
                    //    var value = notFoundInRegexGroups(item.SourceColumn);
                    //    if (value != null)
                    //    {
                    //        item.Value = value;
                    //    }
                    //}
                }
                return true;
            }
            return false;
        }

        public static DynamicSword ExecuteWithRegex(this d.IDbCommand command, string source, System.Text.RegularExpressions.Regex regex,
            Func<string, object> regexNotFoundOrValueIsNull = null)
        {
            var outputParameters = new DynamicSword();
            if (regex.TrySetSqlCommandParameterValues(source, command, regexNotFoundOrValueIsNull))
            {
                try
                {
                    if (command.Connection.State != d.ConnectionState.Open)
                    {
                        command.CommandTimeout = Data.Timeout;
                        command.Connection.Open();                        
                    }
                    command.ExecuteNonQuery();
                    command.Connection.Close();
                    foreach (d.IDbDataParameter parameter in command.Parameters)
                    {
                        if(parameter.Direction == d.ParameterDirection.InputOutput || parameter.Direction == d.ParameterDirection.Output)
                        {
                            var field = parameter.ParameterName.Replace("@", "");
                            outputParameters[field] = parameter.Value;
                        }
                    }
                }
                catch (Exception ex)
                {
                    string formatted = string.Format("Execution of 'ExecuteWithRegex' SqlCommand:{0}, ErrorMessage:{1}", command.CommandText, ex.Message);
                    throw new Exception(formatted);
                }
            }
            else
            {
                string formatted = string.Format("Failed to 'ExecuteWithRegex' SqlCommand:{0}", command.CommandText);
                throw new Exception(formatted);
            }
            return outputParameters;
        }

        #endregion

        #region Internal Methods

        public static void setByCast(d.IDbDataParameter parameter, object value)
		{            
	 
			switch (parameter.DbType)
			{
				case System.Data.DbType.AnsiString:
				case System.Data.DbType.AnsiStringFixedLength:
				case System.Data.DbType.Xml:
				case System.Data.DbType.String:                    
				case System.Data.DbType.StringFixedLength:
					if (value is string)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = value.ToString();
					}
					break;
				case System.Data.DbType.Boolean:
					if (value is bool)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToBoolean(value);
					}
					break;
				case System.Data.DbType.SByte:
				case System.Data.DbType.Byte:
					if (value is byte)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToByte(value);
					}
					break;
				case System.Data.DbType.VarNumeric:
				case System.Data.DbType.Currency:
				case System.Data.DbType.Decimal:
					if (value is decimal)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToDecimal(value);
					}                    
					break;
				case System.Data.DbType.Double:
					if (value is double || value is decimal)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToDouble(value);
					}
					break;
				case System.Data.DbType.Date:                    
				case System.Data.DbType.DateTime:                    
				case System.Data.DbType.DateTime2:
					if (value is DateTime)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToDateTime(value);
					}
					break;                
				case System.Data.DbType.Guid:
					if (value is Guid)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = new Guid(value.ToString());
					}
					break;
				case System.Data.DbType.UInt16:
				case System.Data.DbType.Int16:
					if (value is Int16)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToInt16(value);
					}
					break;
				case System.Data.DbType.UInt32:
				case System.Data.DbType.Int32:
					if (value is Int32)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToInt32(value);
					}
					break;
				case System.Data.DbType.UInt64:
				case System.Data.DbType.Int64:
					if (value is Int64)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToInt64(value);
					}
					break;                
				case System.Data.DbType.Single:
					if (value is long)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ToSingle(value);
					}
					break;
				case System.Data.DbType.Time:
					if (value is TimeSpan)
					{
						parameter.Value = value;
					}
					else
					{
						parameter.Value = Convert.ChangeType(value, typeof(TimeSpan));
					}
					break;
				case System.Data.DbType.DateTimeOffset:
				case System.Data.DbType.Binary:
				case System.Data.DbType.Object:
				default:
					parameter.Value = value;
					break;
			}
		}

		public static void setByStatic(d.IDbDataParameter parameter, object value)
		{
			parameter.Value = value;
		}


		private static Action<d.IDbDataParameter, object> m__setParameter = setByStatic;
		public static Action<d.IDbDataParameter, object> _setParameter
		{
			get { return m__setParameter; }
			set { m__setParameter = value; }
		}
				

		internal static void setParameter<T>(T obj, d.IDbCommand command)
			where T : Sword.IDynamic
		{
			try
			{
				if (obj != null)
				{
					foreach (d.IDbDataParameter parameter in command.Parameters)
					{
						if (parameter.Direction == d.ParameterDirection.Input ||
							parameter.Direction == d.ParameterDirection.InputOutput)
						{
							var value = obj[!string.IsNullOrEmpty(parameter.SourceColumn) ? parameter.SourceColumn : parameter.ParameterName.Replace("@", "")];
							if (value != null)
							{
								_setParameter(parameter, value);                                
							}
							else
							{
								parameter.Value = DBNull.Value;
							}
						}
					}
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		internal static void setParameter(dynamic obj, d.IDbCommand command)
		{
			try
			{
				if (obj is IDynamic)
				{
					setParameter((IDynamic)obj, command);
				}
				else
				{
					foreach (d.IDbDataParameter parameter in command.Parameters)
					{
						if (parameter.Direction == d.ParameterDirection.Input ||
							parameter.Direction == d.ParameterDirection.InputOutput)
						{
							var value = Data.GetValue((object)obj, parameter.SourceColumn);
							if (value != null)
							{
								parameter.Value = value;
							}
							else
							{
								parameter.Value = DBNull.Value;
							}
						}
					}
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		internal static void setOutputParameters<T>(T obj, d.IDbCommand command)
			where T : Sword.IDynamic
		{
			try
			{
				foreach (d.IDataParameter p in command.Parameters)
				{
					if (p.Direction == d.ParameterDirection.Output || p.Direction == d.ParameterDirection.InputOutput)
					{
						object value = p.Value;
						if (value == DBNull.Value)
						{
							value = null;
						}
						obj[!string.IsNullOrEmpty(p.SourceColumn) ? p.SourceColumn : p.ParameterName.Replace("@", "")] = value;
					}
				}
			}
			catch (Exception)
			{

				throw;
			}
		}

		internal static void setOutputParameters(dynamic obj, d.IDbCommand command)    
		{
			try
			{
				if (obj is IDynamic)
				{
					setOutputParameters((IDynamic)obj, command);
				}
				else
				{
					//mod this area
					//need to reflect here
					foreach (d.IDataParameter p in command.Parameters)
					{
						if (p.Direction == d.ParameterDirection.Output || p.Direction == d.ParameterDirection.InputOutput)
						{
							object value = p.Value;
							if (value == DBNull.Value)
							{
								value = null;
							}
							Data.SetValue(obj, !string.IsNullOrEmpty(p.SourceColumn) ? p.SourceColumn : p.ParameterName.Replace("@", ""), value);
						}
					}
				}
			}
			catch (Exception)
			{

				throw;
			}
		}

		internal static void setMaps<T>(T obj, d.IDataReader reader, out Dictionary<string, MapPoint> staticallyTypedMap, out Dictionary<string, MapPoint> dynamicMap)
			where T : class, Sword.IDynamic
		{
			staticallyTypedMap = new Dictionary<string, MapPoint>();
			dynamicMap = new Dictionary<string, MapPoint>();
			string[] propertyNames = obj.GetStaticallyTypedPropertyNames();
			if (propertyNames != null)
			{
				foreach (var item in propertyNames)
				{
					staticallyTypedMap.Add(item, new MapPoint());
				}
			}
			for (int i = 0; i < reader.FieldCount; i++)
			{
				var fieldName = reader.GetName(i);
				if (staticallyTypedMap.ContainsKey(fieldName))
				{
					var found = staticallyTypedMap[fieldName];
					var type = sqlDbType(i, reader);
					found.Index = i;
					found.Type = type;
				}
				else
				{
					try
					{
						dynamicMap.Add(fieldName, new MapPoint { Index = i });
					}
					catch (Exception)
					{
						throw;
					}
				}
			}
		}

		//interface independent
		internal static d.SqlDbType sqlDbType(int i, d.IDataReader reader)
		{
			try
			{
				var name = reader.GetFieldType(i).Name;
				switch (name)
				{
					case "Int32": return d.SqlDbType.Int;
					case "DateTime": return d.SqlDbType.DateTime;
					case "String":
					case "Xml": return d.SqlDbType.VarChar;
					case "Boolean": return d.SqlDbType.Bit;
					case "Byte": return d.SqlDbType.TinyInt;
					case "Double": return d.SqlDbType.Float;
					case "Int16": return d.SqlDbType.SmallInt;
					case "Int64": return d.SqlDbType.BigInt;
					case "FileStream":
					case "byte[]": return d.SqlDbType.Binary;
					case "Guid": return d.SqlDbType.UniqueIdentifier;
					case "Money":
					case "Decimal": return d.SqlDbType.Decimal;
					case "Single": return d.SqlDbType.Real;
					default:
						return d.SqlDbType.Variant;
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		#endregion

		#region Properties

		private static int m_Timeout = 15;
		/// <summary>
		/// Time in seconds to wait before timeout
		/// </summary>
		public static int Timeout
		{
			get { return m_Timeout; }
			set { m_Timeout = value; }
		}

		private static bool m_IgnoreNotFoundFields = false;
		public static bool IgnoreNotFoundFields
		{
			get { return m_IgnoreNotFoundFields; }
			set { m_IgnoreNotFoundFields = value; }
		}

		private static List<Tuple<string, string, d.SqlClient.SqlCommand>> m_cachedCommands = new List<Tuple<string, string, d.SqlClient.SqlCommand>>();
		internal static List<Tuple<string, string, d.SqlClient.SqlCommand>> cachedCommands
		{
			get { return m_cachedCommands; }
			set { m_cachedCommands = value; }
		}

		private static List<DynamicTable> _Tables = new List<DynamicTable>();
		public static List<DynamicTable> Tables
		{
			get { return _Tables; }
			set { _Tables = value; }
		}

		#endregion

		#region Database Extension Methods

		#region Execute
		
		/// <summary>
		/// if passing anon type be aware that anon type properties are read only
		/// so if have output parameters from stored procedure you should use DynamicSword or
		/// a defined class
		/// </summary>
		/// <param name="obj"></param>
		/// <param name="command"></param>
		/// <returns></returns>
		public static object Execute(this object obj, d.IDbCommand command)            
		{
			return command.Execute(obj);
		}

		/// <summary>
		/// if passing anon type be aware that anon type properties are read only
		/// so if have output parameters from stored procedure you should use DynamicSword or
		/// a defined class
		/// </summary>
		/// <param name="command"></param>
		/// <param name="obj"></param>
		/// <returns></returns>
		public static object Execute(this d.IDbCommand command, object obj = null)
		{   
			try
			{                
				setParameter(obj, command);
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					command.ExecuteNonQuery();
					setOutputParameters(obj, command);
				}
				command.Connection.Close();            
			}
			catch (Exception)
			{
				throw;
			}
			finally
			{
				command.Connection.Close();
			}
			return obj;
		}


		public static DynamicSword Execute(this d.IDbCommand command, DynamicSword obj)
		{
			return (DynamicSword)command.Execute((object)obj);
		}


		#endregion

		#region First and FirstOrDefault

		//just commenting out for now 6/4/2013 Nathan as far as i know its not used
		/// <summary>
		/// Default Return is null if reader returns no first read
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="obj"></param>
		/// <param name="command"></param>
		/// <returns></returns>
		public static T First<T>(this T obj, d.IDbCommand command)
			where T : class, IDynamic, new()
		{
			var ret = new T();
			bool found = false;
			try
			{
				setParameter(obj, command);
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
				  //  SetAsLoading(obj);


					using (var reader = command.ExecuteReader())
					{
						Dictionary<string, MapPoint> staticallyTypedMap;
						Dictionary<string, MapPoint> dynamicallyTypedMap;
						setMaps(obj, reader, out staticallyTypedMap, out dynamicallyTypedMap);
						while (reader.Read())
						{
							var newObj = new T();
						   // SetAsLoading(newObj);
							newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
							ret = newObj;
							found = true;
							break;
						}
						setOutputParameters(obj, command);
					}
					//slows down just slightly
					//AcceptChanges(obj);
					//AcceptChanges(ret);
				}
			}
			catch (System.Data.SqlClient.SqlException sqlException)
			{
				throw sqlException;
			}
			catch (Exception)
			{
				throw;
			}
			finally
			{
				command.Connection.Close();
			}
			return found ? ret : null;
		}        

		/// <summary>
		/// if passing anon type be aware that anon type properties are read only
		/// so if have output parameters from stored procedure you should use DynamicSword or
		/// a defined class
		/// </summary>
		/// <param name="command"></param>
		/// <param name="parameters"></param>
		/// <returns></returns>
		public static DynamicSword FirstOrDefault(this d.IDbCommand command, object parameters = null)
		{
			return command.FirstOrDefault<DynamicSword>(parameters);
		}

		/// <summary>
		/// if passing anon type be aware that anon type properties are read only
		/// so if have output parameters from stored procedure you should use DynamicSword or
		/// a defined class
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="command"></param>
		/// <param name="parameters"></param>
		/// <returns></returns>
		public static T FirstOrDefault<T>(this d.IDbCommand command, object parameters = null)
			 where T : DynamicSword, new()
		{
			try
			{
				//var convertedParameters = Data.ToDynamicSword(parameters);
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					if (command.Parameters.Count > 0)
					{
						setParameter(parameters, command);
					}
					var newObj = default(T);
					using (var reader = command.ExecuteReader())
					{   
						Dictionary<string, MapPoint> staticallyTypedMap;
						Dictionary<string, MapPoint> dynamicallyTypedMap;
						setMaps(new T(), reader, out staticallyTypedMap, out dynamicallyTypedMap);
						while (reader.Read())
						{
							newObj = new T();
						//    SetAsLoading(newObj);
							newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
							break;
						}           
					}
					setOutputParameters(parameters, command);
					return newObj;
				}
			}
			catch (System.Data.SqlClient.SqlException sqlException)
			{
				throw sqlException;


			}
			catch (Exception)
			{
				throw;
			}
			finally
			{
				command.Connection.Close();
			}
			return null;
		}


		public static bool DoFirst(this d.IDbCommand command, Action<DynamicSword> doAction, object parameters = null)
		{
			return command.DoFirst<DynamicSword>(doAction, parameters);
		}

		public static bool DoFirst<T>(this d.IDbCommand command, Action<T> doAction, object parameters = null)
			where T : DynamicSword, new()
		{
			var found = command.FirstOrDefault<T>(parameters);
			if (found != null)
			{
				doAction(found);
				return true;
			}
			return false;
		}

		public static bool DoFirst<T>(this T obj, d.IDbCommand command, Action<T> doAction)
			where T : class, IDynamic, new()
		{
			var found = obj.First<T>(command);
			if (found != null)
			{
				doAction(found);
				return true;
			}
			return false;
		}

		public static bool DoFirst<T>(this List<T> list, Func<T, bool> where, Action<T> doAction)
		{
			var found = list.FirstOrDefault(where);
			if (found != null)
			{
				doAction(found);
				return true;
			}
			return false;
		}

		#endregion

		#region ToList


		

		/// <summary>
		/// when using this method parameter can be an anonymous type or object or DynamicSword
		/// if you anticipate output parameters you should use DynamicSword as the parameters otherwise
		/// you will not get the output parameter added to the parameters Parameter 
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="command"></param>
		/// <param name="parameters"></param>
		/// <returns></returns>
		public static List<T> ToList<T>(this d.IDbCommand command, object parameters = null)
			where T : class, IDynamic, new()
		{
			var ret = new List<T>();
			try
			{                
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					if (command.Parameters.Count > 0)
					{
						setParameter(parameters, command);
					}
					using (var reader = command.ExecuteReader())
					{
						Dictionary<string, MapPoint> staticallyTypedMap;
						Dictionary<string, MapPoint> dynamicallyTypedMap;
						setMaps(new T(), reader, out staticallyTypedMap, out dynamicallyTypedMap);
						while (reader.Read())
						{
							var newObj = new T();
					   //     SetAsLoading(newObj);
							newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
							ret.Add(newObj);
						}
					}
					setOutputParameters(parameters, command);
				}
			}
			catch (System.Data.SqlClient.SqlException sqlException)
			{
				throw sqlException;
			}
			catch (Exception)
			{
				throw;
			}
			finally
			{
				command.Connection.Close();
			}
			return ret;
		}

		/// <summary>
		/// when using this method parameter can be an anonymous type or object or DynamicSword
		/// if you anticipate output parameters you should use DynamicSword as the parameters otherwise
		/// you will not get the output parameter added to the parameters Parameter 
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="command"></param>
		/// <param name="parameters"></param>
		/// <returns></returns>
		public static List<DynamicSword> ToList(this d.IDbCommand command, object parameters = null)
		{
			return command.ToList<DynamicSword>(parameters);
		}

		#endregion

		/// <summary>
		/// if the IDynamic has table fields those are used other wise you must provide the field array
		/// </summary>
		/// <typeparam name="T"></typeparam>
		/// <param name="objects"></param>
		/// <param name="connectionString"></param>
		/// <param name="tableName"></param>
		/// <param name="batchSize"></param>
		/// <param name="fieldArray"></param>
		/// <param name="preInsert"></param>
		public static void BulkInsert<T>(this List<T> objects, string connectionString, string tableName, int batchSize = 5000, string[] fieldArray = null, Action<T> preInsert = null)
			where T : class, IDynamic, new()
		{
			if (objects.Count > 0)
			{
				//prep a datatable
				if (fieldArray == null)
				{
					if (objects[0].TableFields() != null)
					{
						fieldArray = objects[0].TableFields();
					}
					else
					{
						fieldArray = objects[0].PropertyNames();
					}
				}

				var table = new System.Data.DataTable();
				for (int i = 0; i < fieldArray.Length; i++)
				{
					table.Columns.Add(fieldArray[i]);
				}

				if (preInsert != null)
				{
					foreach (var item in objects)
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
					foreach (var item in objects)
					{
						object[] row = new object[fieldArray.Length];
						for (int i = 0; i < fieldArray.Length; i++)
						{
							row[i] = item[fieldArray[i]];
						}
						table.Rows.Add(row);
					}
				}

				using (d.SqlClient.SqlBulkCopy bulkCopy = new d.SqlClient.SqlBulkCopy(connectionString))
				{
					bulkCopy.BulkCopyTimeout = Timeout;
					bulkCopy.BatchSize = batchSize;
					if (tableName.IndexOf(".") == -1)
					{
						tableName = "dbo.[" + tableName + "]";
					}
					bulkCopy.DestinationTableName = tableName;
					try
					{
						bulkCopy.WriteToServer(table);
					}
					catch (Exception ex)
					{
						throw ex;
					}
				}
			}
		}

		public static void BulkInsert<T>(this List<T> objects, DynamicTable dynamicTable, int batchSize = 5000, Action<T> preInsert = null)
			where T : class, IDynamic, new()
		{
			if (objects.Count > 0)
			{
				//prep a datatable
				var fieldArray = dynamicTable.Fields();
				string tableName = dynamicTable.Name;
				var table = new System.Data.DataTable();
				for (int i = 0; i < fieldArray.Length; i++)
				{
					table.Columns.Add(fieldArray[i]);
				}

				if (preInsert != null)
				{
					foreach (var item in objects)
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
					foreach (var item in objects)
					{
						object[] row = new object[fieldArray.Length];
						for (int i = 0; i < fieldArray.Length; i++)
						{
							row[i] = item[fieldArray[i]];
						}
						table.Rows.Add(row);
					}
				}

				using (d.SqlClient.SqlBulkCopy bulkCopy = new d.SqlClient.SqlBulkCopy(dynamicTable.ConnectionString()))
				{
					bulkCopy.BulkCopyTimeout = Timeout;
					bulkCopy.BatchSize = batchSize;
					if (tableName.IndexOf(".") == -1)
					{
						tableName = "dbo.[" + tableName + "]";
					}
					bulkCopy.DestinationTableName = tableName;
					try
					{
						bulkCopy.WriteToServer(table);
					}
					catch (Exception ex)
					{
						throw ex;
					}
				}
                table = null;
			}
		}

		public static void CacheCommand(string commandKey, string connectionString, d.SqlClient.SqlCommand command)
		{
			if (CacheProcedureInfo)
			{
				var found = cachedCommands.FirstOrDefault(o => o.Item1 == commandKey && o.Item2 == connectionString);
				if (found == null)
				{
					cachedCommands.Add(new Tuple<string, string, d.SqlClient.SqlCommand>(commandKey, connectionString, command));
				}
			}
		}

        //SqlCommandBuilder.DeriveParameters(cmd);
		//now all object code smithed can point here
		public static d.SqlClient.SqlCommand GetCommand(this string commandText, string connectionString, d.CommandType commandType = d.CommandType.StoredProcedure)
		{
			var found = cachedCommands.FirstOrDefault(o => o.Item1 == commandText && o.Item2 == connectionString);
			if (found == null)
			{
                connectionString = ConnectionStringTimeout(connectionString);
				using (var conn = new d.SqlClient.SqlConnection(connectionString))
				{   
					var sqlCommand = new d.SqlClient.SqlCommand
					{
						CommandText = commandText,
                        CommandType = commandType
					};
					if (commandText.ToLower().Substring(0, 6) == "select")
					{
                        commandType = d.CommandType.Text;
					}

                    if (commandType == d.CommandType.StoredProcedure)
					{

                        var temp = new System.Data.SqlClient.SqlCommand{
                            CommandText = commandText,
                            Connection = conn,
                            CommandType = d.CommandType.StoredProcedure
                        };
                        conn.Open();
                        System.Data.SqlClient.SqlCommandBuilder.DeriveParameters(temp);                        
                        foreach (System.Data.SqlClient.SqlParameter p in temp.Parameters)
                        {
                            sqlCommand.Parameters.Add(new d.SqlClient.SqlParameter
                            {
                                Direction = p.Direction,
                                ParameterName = p.ParameterName,
                                SqlDbType = p.SqlDbType,
                                Size = p.Size,
                                Precision = p.Precision,
                                Scale = p.Scale,
                                SourceColumn = p.ParameterName.Replace("@", "")
                            });
                        }
                        conn.Close();
					}
					else
					{
						sqlCommand.CommandType = d.CommandType.Text;
						var regex = new System.Text.RegularExpressions.Regex("@\\w+");
						var matches = regex.Matches(sqlCommand.CommandText);
						foreach (System.Text.RegularExpressions.Match match in matches)
						{
							sqlCommand.Parameters.Add(new d.SqlClient.SqlParameter
							{
								ParameterName = match.Value,
								SourceColumn = match.Value.Replace("@", "")
							});
						}
					}
					cachedCommands.Add(new Tuple<string, string, d.SqlClient.SqlCommand>(commandText, connectionString, sqlCommand));
					sqlCommand.Connection = new d.SqlClient.SqlConnection(connectionString);
					return sqlCommand;
				}
			}
			else
			{
				var sqlCommand = new d.SqlClient.SqlCommand { CommandText = found.Item1, Connection = new d.SqlClient.SqlConnection(found.Item2) };
				sqlCommand.CommandType = found.Item3.CommandType;
				foreach (d.SqlClient.SqlParameter item in found.Item3.Parameters)
				{
					sqlCommand.Parameters.Add(new d.SqlClient.SqlParameter
					{
						Direction = item.Direction,
						ParameterName = item.ParameterName,
						SqlDbType = item.SqlDbType,
						Size = item.Size,
						Precision = item.Precision,
						Scale = item.Scale,
						SourceColumn = item.ParameterName.Replace("@", "")
					});
				}
				return sqlCommand;
			}
		}

        //static System.Data.SqlDbType getSqlDbType(string value)
        //{
        //    if (value == "numeric")
        //    {
        //        return System.Data.SqlDbType.Decimal;
        //    }
        //    else
        //    {
        //        if (value == null)
        //        {
        //            return d.SqlDbType.Variant;
        //        }
        //        return (System.Data.SqlDbType)System.Enum.Parse(typeof(System.Data.SqlDbType), value, true);
        //    }
        //}

//        static string getParameterSchemaSelectString(string procedureName)
//        {
//            return
//                @"
//					SELECT     
//						case when r.PARAMETER_MODE = 'IN' then 1
//							when r.PARAMETER_MODE = 'OUT' and r.Parameter_Name = '' then 6
//							when r.PARAMETER_MODE = 'OUT' then 2 
//							when r.PARAMETER_MODE = 'INOUT' then 3 end  Direction,
//						case when r.Parameter_Name = '' then '@RETURN_VALUE'
//							else r.Parameter_Name end ParameterName,
//						r.DATA_TYPE DataType,
//						r.CHARACTER_MAXIMUM_LENGTH Size,
//						r.NUMERIC_PRECISION [Precision],
//						r.NUMERIC_SCALE Scale,  r.SPECIFIC_NAME
//					FROM
//						INFORMATION_SCHEMA.Parameters r
//					WHERE
//						r.SPECIFIC_NAME = '" + procedureName + "'";
//        }
		
		public static bool CanConnect(string connectionString)
		{
			bool ret = false;
			try
			{
				using (System.Data.SqlClient.SqlConnection conn = new System.Data.SqlClient.SqlConnection(connectionString))
				{
					conn.Open();
				}
				ret = true;
			}
			catch
			{
			}
			return ret;

		}

        public static IResultSet<DynamicSword>[] GetResultSet<P>(this P parameters, d.IDbCommand command)
            where P : DynamicSword, new()
        {
            List<IResultSet<DynamicSword>> resultSet = new List<IResultSet<DynamicSword>>();
            try
            {   
                setParameter(parameters, command);
                if (command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    command.CommandTimeout = Timeout;
                    command.Connection.Open();
                }
                if (command.Connection.State == System.Data.ConnectionState.Open)
                {
                    try
                    {
                        using (d.IDataReader reader = command.ExecuteReader())
                        {
                            var next = true;
                            while (next)
                            {
                                int fieldCount = reader.FieldCount;
                                var obj = new IResultSet<DynamicSword>();
                                resultSet.Add(obj);
                                obj.FillData(reader);
                                next = reader.NextResult();
                            }
                        }
                    }
                    catch (Exception)
                    {

                        throw;
                    }
                    finally
                    {
                        command.Connection.Close();
                    }
                }

                setOutputParameters(parameters, command);
                //   AcceptChanges(parameters);
            }
            catch (Exception)
            {
                throw;
            }
            return resultSet.ToArray();
        }

		public static void FillResultSet<P>(this P parameters, IResultSet[] objectReferences, d.IDbCommand command)
			where P : DynamicSword, new()
		{
			try
			{
		 //       SetAsLoading(parameters);
				setParameter(parameters, command);

				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					try
					{
						using (d.IDataReader reader = command.ExecuteReader())
						{
							var next = true;
							while (next)
							{
								int fieldCount = reader.FieldCount;
								IResultSet obj = objectReferences.OrderByDescending(o => o.ReaderColumnMatchCount(reader)).FirstOrDefault();
								obj.FillData(reader);
								next = reader.NextResult();
							}
						}
					}
					catch (Exception)
					{

						throw;
					}
					finally
					{
						command.Connection.Close();
					}
				}

				setOutputParameters(parameters, command);
			 //   AcceptChanges(parameters);
			}
			catch (Exception)
			{
				throw;
			}
		}

		public static object GetValue(object obj, string property)
		{
			try
			{
				if (obj is DynamicSword)
				{
					return ((DynamicSword)obj)[property];
				}
				else
				{   
					var prop = TypeDescriptor.GetProperties(obj)[property];
					if (prop != null)
					{
						var value = prop.GetValue(obj);
						return value;
					}
				}
			}
			catch (Exception)
			{
				throw;
			}
			return null;
		}

		public static void SetValue(object obj, string property, object value)
		{
			try
			{
				if (obj != null)
				{
					var prop = TypeDescriptor.GetProperties(obj)[property];
					if (prop != null)
					{
						prop.SetValue(obj, value);
					}
				}
			}
			catch (Exception)
			{
				throw;
			}
		}

		public static List<T> Get<T>(this T obj, d.IDbCommand command)
			where T : class, IDynamic, new()
		{
			var ret = new List<T>();
			try
			{
				setParameter(obj, command);
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
			   //     SetAsLoading(obj);
					using (var reader = command.ExecuteReader())
					{
						Dictionary<string, MapPoint> staticallyTypedMap;
						Dictionary<string, MapPoint> dynamicallyTypedMap;
						setMaps(obj, reader, out staticallyTypedMap, out dynamicallyTypedMap);
						while (reader.Read())
						{
							var newObj = new T();
					//        SetAsLoading(newObj);
							newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
							ret.Add(newObj);
						}
						setOutputParameters(obj, command);
					}
					//slows down just slightly
				 //   AcceptChanges(obj);
				//    ret.ForEach(o => AcceptChanges(o));
				}
			}
			catch (System.Data.SqlClient.SqlException sqlException)
			{
				throw sqlException;


			}
			catch (Exception)
			{
				throw;
			}
			finally
			{
				command.Connection.Close();
			}
			return ret;
		}

		internal static d.SqlClient.SqlParameter getParameter(string sourceColumn, dynamic value)
		{
			if (value == null)
			{
				value = DBNull.Value;
			}
			return new d.SqlClient.SqlParameter
			{
				ParameterName = "@" + sourceColumn,
				SourceColumn = sourceColumn,
				Value = value
			};
		}

		public static IEnumerable<T> Update<T>(this List<T> objs, d.IDbCommand command, Action<Exception, T> exceptionHandler = null)
			where T : class, IDynamic, new()
		{
			try
			{
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					try
					{
						foreach (var obj in objs)
						{
							try
							{
						 //       SetAsLoading(obj);
								setParameter(obj, command);
								command.ExecuteNonQuery();
								setOutputParameters(obj, command);
							}
							catch (Exception ex)
							{
								if (exceptionHandler != null)
								{
									exceptionHandler(ex, obj);
								}
								else
								{
									throw ex;
								}
							}
						}
					  //  objs.ForEach(o => AcceptChanges(o));
					}
					catch (Exception ex2)
					{
						throw ex2;
					}
					finally
					{
						command.Connection.Close();
					}
				}
			}
			catch (Exception ex1)
			{
				if (exceptionHandler != null)
				{
					exceptionHandler(ex1, default(T));
				}
				else
				{
					throw ex1;
				}
			}
			return objs;
		}

		public static IEnumerable<T> Update<T>(this List<T> objs, d.IDbCommand command, Func<T, bool> where, Action<Exception, T> exceptionHandler = null)
			where T : class, IDynamic, new()
		{
			try
			{
				var temp = objs.Where(where).ToList();
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					try
					{
						foreach (var obj in temp)
						{

							try
							{
						//        SetAsLoading(obj);
								setParameter(obj, command);
								command.ExecuteNonQuery();
								setOutputParameters(obj, command);
							}
							catch (Exception ex)
							{
								if (exceptionHandler != null)
								{
									exceptionHandler(ex, obj);
								}
								else
								{
									throw ex;
								}
							}
						}
					//    temp.ForEach(o => AcceptChanges(o));
					}
					catch (Exception ex2)
					{
						throw ex2;
					}
					finally
					{
						command.Connection.Close();
					}
				}
			}
			catch (Exception ex1)
			{
				if (exceptionHandler != null)
				{
					exceptionHandler(ex1, default(T));
				}
				else
				{
					throw ex1;
				}
			}
			return objs;
		}

		public static List<R> Get<P, R>(this P obj, d.IDbCommand command)
			where P : class, IDynamic, new()
			where R : class, IDynamic, new()
		{
			var ret = new List<R>();
			try
			{
				setParameter(obj, command);
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					try
					{
					//    SetAsLoading(obj);

						using (var reader = command.ExecuteReader())
						{
							Dictionary<string, MapPoint> staticallyTypedMap;
							Dictionary<string, MapPoint> dynamicallyTypedMap;
							setMaps(obj, reader, out staticallyTypedMap, out dynamicallyTypedMap);
							while (reader.Read())
							{
								var newObj = new R();
						 //       SetAsLoading(obj);
								obj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
								//setValueFromReader(newObj, reader, cache);
								ret.Add(newObj);
							}
							setOutputParameters(obj, command);
						}
				   //     AcceptChanges(obj);
				//        ret.ForEach(o => AcceptChanges(o));
					}
					catch (Exception)
					{
						throw;
					}
					finally
					{
						command.Connection.Close();
					}
				}
			}
			catch (Exception)
			{
				throw;
			}
			finally
			{
				command.Connection.Close();
			}
			return ret;
		}

		public static void RunJob(string jobName, string connectionString)
		{
			try
			{
				string commandtxt = @"sp_start_job";
				using (var conn = new System.Data.SqlClient.SqlConnection(connectionString))
				{
					using (var cmd = new System.Data.SqlClient.SqlCommand(commandtxt, conn))
					{
						cmd.CommandType = d.CommandType.StoredProcedure;
						cmd.Parameters.AddRange(new System.Data.SqlClient.SqlParameter[]{
							new System.Data.SqlClient.SqlParameter{ ParameterName = "@job_name", Value = jobName},
							new System.Data.SqlClient.SqlParameter{ ParameterName = "@job_id", Value = DBNull.Value},
							new System.Data.SqlClient.SqlParameter{ ParameterName = "@error_flag", Value = DBNull.Value},
							new System.Data.SqlClient.SqlParameter{ ParameterName = "@server_name", Value = DBNull.Value},
							new System.Data.SqlClient.SqlParameter{ ParameterName = "@step_name", Value = DBNull.Value},
							new System.Data.SqlClient.SqlParameter{ ParameterName = "@output_flag", Value = DBNull.Value}
						});
						conn.Open();
						cmd.ExecuteNonQuery();
					}
				}
			}
			catch (Exception ex)
			{
				throw ex;
			}
		}

		public static R ExecuteScalar<T, R>(this T obj, d.IDbCommand command)
			where T : class, IDynamic, new()
			where R : struct
		{
			R ret = default(R);
			try
			{
				setParameter(obj, command);
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					if (command.CommandType == d.CommandType.StoredProcedure)
					{
				 //       SetAsLoading(obj);
						setParameter(obj, command);
						command.ExecuteNonQuery();
						if (!command.Parameters.Contains("@RETURN_VALUE"))
						{
							object returnValue = ((d.Common.DbParameter)command.Parameters["@RETURN_VALUE"]).Value;
							if (returnValue != DBNull.Value)
							{
								try
								{
									ret = (R)returnValue;
								}
								catch
								{
									try
									{
										ret = (R)Convert.ChangeType(returnValue, typeof(R));
									}
									catch (Exception ex)
									{
										throw ex;
									}
								}
							}
						}
						setOutputParameters(obj, command);
					 //   AcceptChanges(obj);
					}
					command.Connection.Close();
				}
			}
			catch (Exception ex)
			{
				throw ex;

			}
			finally
			{
				command.Connection.Close();
			}

			return ret;
		}

		public static int ExecuteWithReturn<T>(T obj, d.IDbCommand command)
			where T : class, IDynamic, new()
		{
			int ret = 0;
			try
			{
			 //   SetAsLoading(obj);
				setParameter(obj, command);
				if (command.Connection.State == System.Data.ConnectionState.Closed)
				{
					command.CommandTimeout = Timeout;
					command.Connection.Open();
				}
				if (command.Connection.State == System.Data.ConnectionState.Open)
				{
					ret = command.ExecuteNonQuery();
					setOutputParameters(obj, command);

					command.Connection.Close();
				}
			 //   AcceptChanges(obj);
			}
			catch (Exception ex)
			{
				throw ex;
			}
			finally
			{
				command.Connection.Close();
			}
			return ret;
		}

		public static TransactionResult Transaction<T>(this T parameters, d.IDbCommand command)
			where T : class, IDynamic, new()
		{
			TransactionResult ret = new TransactionResult { Successful = false };
			var connection = command.Connection;
			if (command.Connection.State == System.Data.ConnectionState.Closed)
			{
				command.CommandTimeout = Timeout;
				command.Connection.Open();
			}
			if (command.Connection.State == System.Data.ConnectionState.Open)
			{
				var transaction = connection.BeginTransaction();
				try
				{
				 //   SetAsLoading(parameters);
					setParameter(parameters, command);
					command.Transaction = transaction;
					command.ExecuteNonQuery();
					transaction.Commit();
					ret.Successful = true;
					setOutputParameters(parameters, command);
			  //      AcceptChanges(parameters);
				}
				catch (System.Data.SqlClient.SqlException sql)
				{
					transaction.Rollback();
					ret.Exception = sql;
				}
				catch (Exception ex)
				{
					transaction.Rollback();
					ret.Exception = ex;
				}
				finally
				{
					command.Connection.Close();
				}
			}
			return ret;
		}

		#endregion

		#region Object Extensions



        public static List<T> GetChunk<T>(this List<T> theList, int chunkSize)
        {
            List<T> result = new List<T>();

            chunkSize = (chunkSize <= theList.Count ? chunkSize : theList.Count);

            for (int i = 0; i < chunkSize; i++)
            {
                result.Add(theList[i]);
            }

            theList.RemoveRange(0, chunkSize);
            //GC.Collect();
            return result;
        }

        /// <summary>
        /// Action needs to handle exceptions by itself
        /// this method presumes only to run the action not handle errors at all
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="objs"></param>
        /// <param name="action"></param>
        /// <param name="taskCount"></param>
        public static void RunAsTasks<T>(this List<T> objs, Action<T> action, int taskCount, bool useGarbageCollection = false)
            where T : DynamicSword
        {
            foreach (var obj in objs)
            {
                obj["TaskProcessed"] = false;
            }
            //int totalCount = 0;
            while (objs.Count(o => !(bool)o["TaskProcessed"]) > 0)
            {
                var tasks = new List<Task>();
                var tempObjs = objs.Where(o => !(bool)o["TaskProcessed"]).Take(taskCount).ToList();
                foreach (var obj in tempObjs)
                {
                    tasks.Add(
                                Task.Factory.StartNew(
                                    () =>
                                    {
                                        try
                                        {
                                            action(obj);
                                        }
                                        finally
                                        {
                                            obj["TaskProcessed"] = true;
                                        }
                                    }));

                }
                Task.WaitAll(tasks.ToArray());
                //totalCount += 20;
                //if (useGarbageCollection && totalCount >= 10000)
                //{
                //    GC.Collect();
                //    GC.WaitForPendingFinalizers();
                //    totalCount = 0;
                //}
            }
        }

		public static void Do<T>(this T obj, Func<T, bool> where, Action<T> action)
		{
			if (where(obj))
			{
				action(obj);
			}
		}

        public static void Do<T>(this IList<T> objs, Func<T, bool> where, Action<T> action)
        {
            foreach (var item in objs)
            {
                if (where(item))
                {
                    action(item);
                }
            }
        }

		public static DynamicSword ToDynamicSword(object obj)
		{
			if (obj == null)
			{
				return null;
			}
			else if (obj is DynamicSword)
			{
				return (DynamicSword)obj;
			}
			else
			{
				var ret = new DynamicSword();
				foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(obj.GetType()))
				{
					ret[property.Name] = property.GetValue(obj);
				}
				return ret;
			}
		}

		public static DynamicSword ToDynamicSword(object obj, string[] availableFields)
		{
			if (obj == null)
			{
				return null;
			}
			else if (obj is DynamicSword)
			{
				var temp = (DynamicSword)obj;
				var propNames = temp.PropertyNames();
				var fixedParameter = new DynamicSword();
				foreach (var item in propNames)
				{
					if (availableFields.Contains(item))
					{
						fixedParameter[item] = temp[item];
					}
				}
				return fixedParameter;
			}
			else
			{
				var ret = new DynamicSword();
				foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(obj.GetType()))
				{
					if (availableFields.Contains(property.Name))
					{
						ret[property.Name] = property.GetValue(obj);
					}
				}
				return ret;
			}
		}

		public static bool InsensitveMatch(this string source, string compareTo)
		{
			return source.Equals(compareTo, StringComparison.OrdinalIgnoreCase);
		}

		public static IEnumerable<TSource> IndexRange<TSource>(this IList<TSource> source, int fromIndex, int toIndex)
		{
			int currIndex = fromIndex;
			while (currIndex <= toIndex)
			{
				yield return source[currIndex];
				currIndex++;
			}
		}

		//public static void SetAsLoading(IDynamic obj)
		//{
		//    if (obj is ISwordState)
		//    {
		//        ((ISwordState)obj).AcceptChanges();
		//        ((ISwordState)obj).ObjectState = SwordState.Loading;
		//    }
		//}

		//public static void AcceptChanges(IDynamic obj)
		//{
		//    if (obj is ISwordState)
		//    {
		//        ((ISwordState)obj).AcceptChanges();
		//    }
		//}

		public static output Clone<output, input>(this output target, input source)
			where input : class, IDynamic, new()
			where output : class, IDynamic, new()
		{
			try
			{
				if (source != null)
				{
					var propNames = target.PropertyNames();
					foreach (var item in propNames)
					{
						var value = source[item];
						target[item] = value;
					}
				}
				return target;
			}
			catch (Exception)
			{
				throw;
			}
		}

		public static output Clone<output, input>(this output target, input source, string[] propertyNames)
			where input : class, IDynamic, new()
			where output : class, IDynamic, new()
		{
			try
			{
				if (source != null)
				{
					foreach (string propName in propertyNames)
					{
						try
						{
					 //       SetAsLoading(target);
							target[propName] = source[propName];
					//        AcceptChanges(target);
						}
						catch (Exception ex)
						{
							throw ex;
						}
					}
				}
				return target;
			}
			catch (Exception)
			{
				throw;
			}
		}

		#endregion

		public static List<T> GetList<T>(int pos, IResultSet[] sourceObjects)
			where T : class, IDynamic, new()
		{
			try
			{
				return (List<T>)((IResultSet<T>)sourceObjects[pos]).ReturnValues;
			}
			catch (Exception)
			{
				throw;
			}
		}

		#region this was from Expression attempt at join stuff

		internal static string replaceTruesOrFalses(string value)
		{
			value = value.Replace("= True", "= 1").Replace("= False", "= 0");
			return value;
		}

		internal static string replaceContains(string value)
		{
			var rxLike = new System.Text.RegularExpressions.Regex("\\w+\\.Contains\\(\"\\w+\"\\)");
			var matches = rxLike.Matches(value);
			foreach (System.Text.RegularExpressions.Match match in matches)
			{
				string newValue = match.Value.Replace(".Contains(", " LIKE ");
				newValue = (newValue.Substring(0, newValue.Length - 2) + "%'").Replace("\"", "'%");
				value = value.Replace(match.Value, newValue);
			}
			return value;
		}

		internal static string replaceStartsWith(string value)
		{
			var rxLike = new System.Text.RegularExpressions.Regex("\\w+\\.StartsWith\\(\"\\w+\"\\)");
			var matches = rxLike.Matches(value);
			foreach (System.Text.RegularExpressions.Match match in matches)
			{
				string newValue = match.Value.Replace(".StartsWith(", " LIKE ");
				newValue = (newValue.Substring(0, newValue.Length - 2) + "%'").Replace("\"", "'");
				value = value.Replace(match.Value, newValue);
			}
			return value;
		}

		internal static string replaceEndsWith(string value)
		{
			var rxLike = new System.Text.RegularExpressions.Regex("\\w+\\.EndsWith\\(\"\\w+\"\\)");
			var matches = rxLike.Matches(value);
			foreach (System.Text.RegularExpressions.Match match in matches)
			{
				string newValue = match.Value.Replace(".EndsWith(", " LIKE ");
				newValue = (newValue.Substring(0, newValue.Length - 2) + "'").Replace("\"", "'%");
				value = value.Replace(match.Value, newValue);
			}
			return value;
		}

		internal static string replaceOperatorsAndQuotes(string value)
		{
			value = value.Replace("AndAlso", "AND").Replace("OrElse", "OR").Replace("\"", "'").Replace("==", "=");
			return value;
		}

		//Enums?
		//Dates between and? 
		internal static string prepWhere<T>(Expression<Func<T, bool>> where)
			where T : IDynamic, new()
		{
			string sWhere = where != null ? where.Body.ToString() : "";
			ParameterExpression parameter = where.Parameters[0];
			string sParameter = parameter.Name + ".";
			if (!string.IsNullOrEmpty(sWhere))
			{
				sWhere = replaceTruesOrFalses(sWhere);
				sWhere = replaceContains(sWhere);
				sWhere = replaceEndsWith(sWhere);
				sWhere = replaceStartsWith(sWhere);
				sWhere = sWhere.Replace(sParameter, "");
				sWhere = " WHERE " + replaceOperatorsAndQuotes(sWhere);
			}
			return sWhere;
		}

        public static string ConnectionStringTimeout(string connectionString)
        {
            if (connectionString.IndexOf("Connection Timeout") == -1 && Data.Timeout != 15)
            {
                connectionString += ";Connection Timeout=" + Data.Timeout.ToString();
            }
            return connectionString;
        }

		//order by? 
		public static List<T> Query<T>(this T obj, Expression<Func<T, bool>> where)
			where T : DynamicSword, new()
		{
			List<T> ret = new List<T>();
			try
			{
				var table = obj.Table;
				string sWhere = prepWhere(where);
				if (!string.IsNullOrEmpty(sWhere))
				{
                    var connString = ConnectionStringTimeout(obj.ObjectConnectionString);
					if (!string.IsNullOrEmpty(table) && !string.IsNullOrEmpty(connString))
					{
						using (d.SqlClient.SqlConnection conn = new d.SqlClient.SqlConnection(connString))
						{
							using (d.SqlClient.SqlCommand cmd = new d.SqlClient.SqlCommand("SELECT * FROM " + table + sWhere, conn))
							{
								conn.Open();
								using (var reader = cmd.ExecuteReader())
								{
									Dictionary<string, MapPoint> staticallyTypedMap;
									Dictionary<string, MapPoint> dynamicallyTypedMap;
									setMaps(obj, reader, out staticallyTypedMap, out dynamicallyTypedMap);
									while (reader.Read())
									{
										var newObj = new T();
								  //      SetAsLoading(newObj);
										newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
										ret.Add(newObj);
									}
								}
							}
						}
					}
				}
			}
			catch (Exception)
			{
				throw;
			}
			return ret;
		}

		//order by?
		public static List<T> Top<T>(this T obj, Expression<Func<T, bool>> where, int top)
			where T : DynamicSword, new()
		{
			List<T> ret = new List<T>();
			try
			{
				var table = obj.Table;
				string sTop = "TOP(" + top.ToString() + ")";
				string sWhere = prepWhere(where);
                var connString = Data.ConnectionStringTimeout(obj.ObjectConnectionString);
				if (!string.IsNullOrEmpty(table) && !string.IsNullOrEmpty(connString))
				{
					using (d.SqlClient.SqlConnection conn = new d.SqlClient.SqlConnection(connString))
					{
						using (d.SqlClient.SqlCommand cmd = new d.SqlClient.SqlCommand("SELECT " + sTop + " * FROM " + table + sWhere, conn))
						{
							conn.Open();
							using (var reader = cmd.ExecuteReader())
							{
								Dictionary<string, MapPoint> staticallyTypedMap;
								Dictionary<string, MapPoint> dynamicallyTypedMap;
								setMaps(obj, reader, out staticallyTypedMap, out dynamicallyTypedMap);
								while (reader.Read())
								{
									var newObj = new T();
							 //       SetAsLoading(newObj);
									newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
									ret.Add(newObj);
								}
							}
						}
					}
				}
			}
			catch (Exception)
			{
				throw;
			}
			return ret;
		}
		
		public static T First<T>(this T obj, Expression<Func<T, bool>> where)
			where T : DynamicSword, new()
		{
			try
			{
				var table = obj.Table;
				string sWhere = prepWhere(where);
				if (!string.IsNullOrEmpty(sWhere))
				{
					var connString = Data.ConnectionStringTimeout(obj.ObjectConnectionString);
					if (!string.IsNullOrEmpty(table) && !string.IsNullOrEmpty(connString))
					{
						using (d.SqlClient.SqlConnection conn = new d.SqlClient.SqlConnection(connString))
						{
							using (d.SqlClient.SqlCommand cmd = new d.SqlClient.SqlCommand("SELECT * FROM " + table + sWhere, conn))
							{
								conn.Open();
								using (var reader = cmd.ExecuteReader())
								{
									Dictionary<string, MapPoint> staticallyTypedMap;
									Dictionary<string, MapPoint> dynamicallyTypedMap;
									setMaps(obj, reader, out staticallyTypedMap, out dynamicallyTypedMap);
									while (reader.Read())
									{
										var newObj = new T();
								  //      SetAsLoading(newObj);
										newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
										return newObj;
									}
								}
							}
						}
					}
				}
			}
			catch (Exception)
			{
				throw;
			}
			return null;
		}

		//do we need to where the Ts?
		public static List<DynamicSword> Select<A, B>(Expression<Func<A, B, bool>> join, Expression<Func<A, B, bool>> where)
			where A : DynamicSword, new()
			where B : DynamicSword, new()
		{
			List<DynamicSword> objs = new List<DynamicSword>();
			var obj = new A();
			//loop the joins parameters
			string output = "SELECT * FROM ";
			output += obj.Table + " " + join.Parameters[0].Name;
			output += " INNER JOIN ";
			output += new B().Table + " " + join.Parameters[1].Name;

			string sJoins = join.Body.ToString().Replace("==", "=").Replace("(", "").Replace(")", "").Replace("AndAlso", "AND").Replace("OrElse", "OR");
			output += " on " + sJoins;

			string sWhere = where != null ? where.Body.ToString() : "";
			if (!string.IsNullOrEmpty(sWhere))
			{

				sWhere = replaceContains(sWhere);
				sWhere = replaceEndsWith(sWhere);
				sWhere = replaceStartsWith(sWhere);
				sWhere = " WHERE " + replaceOperatorsAndQuotes(sWhere);
			}
			output += sWhere;

			var connString = Data.ConnectionStringTimeout(obj.ObjectConnectionString);
			if (!string.IsNullOrEmpty(connString))
			{
				using (d.SqlClient.SqlConnection conn = new d.SqlClient.SqlConnection(connString))
				{
					using (d.SqlClient.SqlCommand cmd = new d.SqlClient.SqlCommand(output, conn))
					{
						conn.Open();
						using (var reader = cmd.ExecuteReader())
						{
							Dictionary<string, MapPoint> staticallyTypedMap;
							Dictionary<string, MapPoint> dynamicallyTypedMap;
							setMaps(obj, reader, out staticallyTypedMap, out dynamicallyTypedMap);
							while (reader.Read())
							{
								var newObj = new DynamicSword();
					   //         SetAsLoading(newObj);
								newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
								objs.Add(newObj);
							}
						}
					}
				}
			}


			return objs;
		}

		#endregion

	}

	public interface IReaderCache<T>
		where T : IDynamic
	{
		void Set(T obj);
		string ColumnName { get; set; }
	}

	public class ReaderDictionary : Dictionary<string, ReaderCache>
	{
		public int Index(string propertyName)
		{
			return this.ContainsKey(propertyName) ? this[propertyName].FieldIndex : -1;
		}
		
	}

	public class ReaderCache
	{
		public ReaderCache(d.SqlDbType type, string columnName, int fieldIndex)
		{
			this.Type = type;
			this.ColumnName = columnName;
			this.FieldIndex = fieldIndex;
		}

		public ReaderCache(string columnName, int fieldIndex)
		{
			this.ColumnName = columnName;
			this.FieldIndex = fieldIndex;
		}


		private int m_FieldIndex;
		public int FieldIndex
		{
			get { return m_FieldIndex; }
			set { m_FieldIndex = value; }
		}

		private d.SqlDbType m_Type;
		public d.SqlDbType Type
		{
			get { return m_Type; }
			set { m_Type = value; }
		}


		private string m_ColumnName;
		public string ColumnName
		{
			get { return m_ColumnName; }
			set { m_ColumnName = value; }
		}
	}

	public class ReaderCache<T, V> : IReaderCache<T>
		where T : IDynamic
	{

		public ReaderCache(string columnName, Func<int, V> readerMethod, d.SqlDbType type, int columnIndex)
		{
			this.ColumnName = columnName;
			this.Index = columnIndex;
			this.SqlType = type;
			this.ReaderMethod = readerMethod;
		}

		private string m_ColumnName;
		public string ColumnName
		{
			get { return m_ColumnName; }
			set { m_ColumnName = value; }
		}


		private d.SqlDbType m_SqlType;
		public d.SqlDbType SqlType
		{
			get { return m_SqlType; }
			set { m_SqlType = value; }
		}


		private int m_Index;
		public int Index
		{
			get { return m_Index; }
			set { m_Index = value; }
		}

		private Func<int, V> m_ReaderMethod;
		public Func<int, V> ReaderMethod
		{
			get { return m_ReaderMethod; }
			set { m_ReaderMethod = value; }
		}

		public void Set(T obj)
		{
			//do type check here for Byte types
			obj[this.ColumnName] = ReaderMethod(this.Index);
		}
	}

	public class TransactionResult
	{

		private bool m_Successful;
		/// <summary>
		/// 
		/// </summary>
		public bool Successful
		{
			get { return m_Successful; }
			set { m_Successful = value; }
		}

		private Exception m_Exception;
		/// <summary>
		/// 
		/// </summary>
		public Exception Exception
		{
			get { return m_Exception; }
			set { m_Exception = value; }
		}

	}

}
