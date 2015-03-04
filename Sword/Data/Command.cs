using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sword
{
    public class Command : System.Data.IDbCommand
    {

        private System.Data.SqlClient.SqlCommand m_command;
        public System.Data.SqlClient.SqlCommand _command
        {
            get { return m_command; }
            set { m_command = value; }
        }
                

        public Command(System.Data.SqlClient.SqlCommand command)
        {
            _command = command;
        }

        public Command(string commandText, string connectionString)
        {
            this._command = Data.GetCommand(commandText, connectionString);
        }

        #region IDbCommand

        public void Cancel()
        {
            _command.Cancel();
        }

        public string CommandText
        {
            get
            {
                return _command.CommandText;
            }
            set
            {
                _command.CommandText = value;
            }
        }

        public int CommandTimeout
        {
            get
            {
                return _command.CommandTimeout;
            }
            set
            {
                _command.CommandTimeout = value;
            }
        }

        public System.Data.CommandType CommandType
        {
            get
            {
                return _command.CommandType;
            }
            set
            {
                _command.CommandType = value;
            }
        }

        public System.Data.IDbConnection Connection
        {
            get
            {
                return _command.Connection;
            }
            set
            {
                var connectionString = Data.ConnectionStringTimeout(value.ConnectionString);
                _command.Connection = new System.Data.SqlClient.SqlConnection(connectionString);
            }
        }

        public System.Data.IDbDataParameter CreateParameter()
        {
            return _command.CreateParameter();
        }

        public int ExecuteNonQuery()
        {
            return _command.ExecuteNonQuery();
        }

        public System.Data.IDataReader ExecuteReader(System.Data.CommandBehavior behavior)
        {
            return _command.ExecuteReader(behavior);
        }

        public System.Data.IDataReader ExecuteReader()
        {
            return _command.ExecuteReader();
        }

        public object ExecuteScalar()
        {
            return _command.ExecuteScalar();
        }

        public System.Data.IDataParameterCollection Parameters
        {
            get { return _command.Parameters; }
        }

        public void Prepare()
        {
            _command.Prepare();
        }

        public void SetTransaction(System.Data.SqlClient.SqlTransaction transaction)
        {
            _command.Transaction = transaction;
        }

        public System.Data.IDbTransaction Transaction
        {
            get
            {
                if (_command.Transaction == null)
                {

                }
                return _command.Transaction;
            }
            set
            {
                //_command.Transaction = _command.Connection.BeginTransaction();
            }
        }

        public System.Data.UpdateRowSource UpdatedRowSource
        {
            get
            {
                return _command.UpdatedRowSource;
            }
            set
            {
                _command.UpdatedRowSource = value;
            }
        }

        public void Dispose()
        {
            _command.Dispose();
        }

        #endregion

        //ready?
        public T Execute<T>(T parameters)
            where T : class, IDynamic, new()
        {            
            try
            {
                Data.setParameter(parameters, _command);
                if (_command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    _command.CommandTimeout = Data.Timeout;
                    _command.Connection.Open();
                }
                if (_command.Connection.State == System.Data.ConnectionState.Open)
                {
                    _command.ExecuteNonQuery();
                    Data.setOutputParameters(parameters, _command);
                }
                _command.Connection.Close();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _command.Connection.Close();
            }            
            return parameters;
        }

        //ready?
        public dynamic Execute(dynamic parameters)
        {
            try
            {
                Data.setParameter(parameters, _command);
                if (_command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    _command.CommandTimeout = Data.Timeout;
                    _command.Connection.Open();
                }
                if (_command.Connection.State == System.Data.ConnectionState.Open)
                {
                    _command.ExecuteNonQuery();
                    Data.setOutputParameters(parameters, _command);
                }
                _command.Connection.Close();
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _command.Connection.Close();
            }
            return parameters;
        }

        //ready?
        public T First<T>(dynamic parameters)
             where T : class, IDynamic, new()
        {
            try
            {
                if (_command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    _command.CommandTimeout = Data.Timeout;
                    _command.Connection.Open();
                }
                if (_command.Connection.State == System.Data.ConnectionState.Open)
                {
                    if (_command.Parameters.Count > 0)
                    {
                        Data.setParameter(parameters, _command);
                    }
                    var newObj = default(T);
                    using (var reader = _command.ExecuteReader())
                    {
                        Dictionary<string, MapPoint> staticallyTypedMap;
                        Dictionary<string, MapPoint> dynamicallyTypedMap;
                        Data.setMaps(new T(), reader, out staticallyTypedMap, out dynamicallyTypedMap);
                        while (reader.Read())
                        {
                            newObj = new T();                            
                            newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
                            break;
                        }
                    }
                    Data.setOutputParameters(parameters, _command);
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
                _command.Connection.Close();
            }
            return null;
        }

        //ready?
        public DynamicSword First(dynamic parameters)
        {
            try
            {   
                if (_command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    _command.CommandTimeout = Data.Timeout;
                    _command.Connection.Open();
                }
                if (_command.Connection.State == System.Data.ConnectionState.Open)
                {
                    if (_command.Parameters.Count > 0)
                    {
                        Data.setParameter(parameters, _command);
                    }
                    DynamicSword newObj = default(DynamicSword);
                    using (var reader = _command.ExecuteReader())
                    {
                        Dictionary<string, MapPoint> staticallyTypedMap;
                        Dictionary<string, MapPoint> dynamicallyTypedMap;
                        Data.setMaps(new DynamicSword(), reader, out staticallyTypedMap, out dynamicallyTypedMap);
                        while (reader.Read())
                        {
                            newObj = new DynamicSword();                            
                            newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
                            break;
                        }
                    }
                    Data.setOutputParameters(parameters, _command);
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
                _command.Connection.Close();
            }
            return null;
        }

        //ready?
        public List<T> ToList<T>(dynamic parameters)
             where T : class, IDynamic, new()
        {
            var ret = new List<T>();
            try
            {
                if (_command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    _command.CommandTimeout = Data.Timeout;
                    _command.Connection.Open();
                }
                if (_command.Connection.State == System.Data.ConnectionState.Open)
                {
                    if (_command.Parameters.Count > 0)
                    {
                        Data.setParameter(parameters, _command);
                    }
                    using (var reader = _command.ExecuteReader())
                    {
                        Dictionary<string, MapPoint> staticallyTypedMap;
                        Dictionary<string, MapPoint> dynamicallyTypedMap;
                        Data.setMaps(new T(), reader, out staticallyTypedMap, out dynamicallyTypedMap);
                        while (reader.Read())
                        {
                            var newObj = new T();                       
                            newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
                            ret.Add(newObj);
                        }
                    }
                    Data.setOutputParameters(parameters, _command);
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
                _command.Connection.Close();
            }
            return ret;
        }

        //ready?
        public List<DynamicSword> ToList(dynamic parameters)
        {
            var ret = new List<DynamicSword>();
            try
            {                
                if (_command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    _command.CommandTimeout = Data.Timeout;
                    _command.Connection.Open();
                }
                if (_command.Connection.State == System.Data.ConnectionState.Open)
                {
                    if (_command.Parameters.Count > 0)
                    {
                        Data.setParameter(parameters, _command);
                    }
                    using (var reader = _command.ExecuteReader())
                    {
                        Dictionary<string, MapPoint> staticallyTypedMap;
                        Dictionary<string, MapPoint> dynamicallyTypedMap;
                        Data.setMaps(new DynamicSword(), reader, out staticallyTypedMap, out dynamicallyTypedMap);
                        while (reader.Read())
                        {
                            var newObj = new DynamicSword();                            
                            newObj.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
                            ret.Add(newObj);
                        }
                    }
                    Data.setOutputParameters(parameters, _command);
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
                _command.Connection.Close();
            }
            return ret;            
        }

        //ready?
        public List<dynamic> Update(List<dynamic> objs)
        {
            try
            {
                if (_command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    _command.CommandTimeout = Data.Timeout;
                    _command.Connection.Open();
                }
                if (_command.Connection.State == System.Data.ConnectionState.Open)
                {
                    try
                    {
                        foreach (var obj in objs)
                        {
                            try
                            {                               
                                Data.setParameter(obj, _command);
                                _command.ExecuteNonQuery();
                                Data.setOutputParameters(obj, _command);
                            }
                            catch (Exception ex)
                            {
                                throw ex;
                            }
                        }
                    }
                    catch (Exception ex2)
                    {
                        throw ex2;
                    }
                    finally
                    {
                        _command.Connection.Close();
                    }
                }
            }
            catch (Exception ex1)
            {
                throw ex1;
            }
            return objs;
        }

        //ready?
        public List<T> Update<T>(List<T> objs)
            where T : class, IDynamic, new()
        {
            try
            {
                if (_command.Connection.State == System.Data.ConnectionState.Closed)
                {
                    _command.CommandTimeout = Data.Timeout;
                    _command.Connection.Open();
                }
                if (_command.Connection.State == System.Data.ConnectionState.Open)
                {
                    try
                    {
                        foreach (var obj in objs)
                        {
                            try
                            {   
                                Data.setParameter(obj, _command);
                                _command.ExecuteNonQuery();
                                Data.setOutputParameters(obj, _command);
                            }
                            catch (Exception ex)
                            {
                                throw ex;
                            }
                        }                        
                    }
                    catch (Exception ex2)
                    {
                        throw ex2;
                    }
                    finally
                    {
                        _command.Connection.Close();
                    }
                }
            }
            catch (Exception ex1)
            {
                throw ex1;
            }
            return objs;
        }


    }
}
