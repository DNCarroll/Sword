using System;

namespace Sword
{
    public static class Setters
    {
        public static T Value<T>(object[] values, MapPoint mapPoint, T defaultValue)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (T)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }
        

        public static bool Bool(object value)
        {
            try
            {
                return value is bool ? (bool)value : value != null ? Convert.ToBoolean(value) : false;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static bool Bool(System.Data.IDataReader reader, MapPoint mapPoint, bool defaultValue = false)
        {
            try 
	        {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index)? reader.GetBoolean(mapPoint.Index):defaultValue;
	        }
	        catch (Exception)
	        {	
		        throw;
	        }            
        }

        public static bool Bool(object[] values, MapPoint mapPoint, bool defaultValue = false)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value?(bool)values[mapPoint.Index]:defaultValue;
            }
            catch (Exception)
            {
                throw;
            }            
        }

        public static byte Byte(object value)
        {
            try
            {
                return value is byte ? (byte)value : value != null ? Convert.ToByte(value) : (byte)0;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static byte Byte(System.Data.IDataReader reader, MapPoint mapPoint, byte defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetByte(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static byte Byte(object[] values, MapPoint mapPoint, byte defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ?
                    (byte)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }            
        }

        public static byte[] Bytes(System.Data.IDataReader reader, MapPoint mapPoint, byte[] defaultValue = null)
        {
            try
            {
                if (mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index))
                {
                    if (mapPoint.Type == System.Data.SqlDbType.Binary || mapPoint.Type == System.Data.SqlDbType.Image)
                    {
                        long size = reader.GetBytes(mapPoint.Index, 0, null, 0, 0);
                        byte[] values = new byte[size];
                        int bufferSize = 1024;
                        long bytesRead = 0;
                        int curPos = 0;
                        while (bytesRead < size)
                        {
                            bytesRead += reader.GetBytes(mapPoint.Index, curPos, values, curPos, bufferSize);
                            curPos += bufferSize;
                        }
                        return values;
                    }
                }
            }
            catch (Exception)
            {
                
                throw;
            }
            return defaultValue;
        }

        public static byte[] Bytes(object[] values, MapPoint mapPoint, byte[] defaultValue = null)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (byte[])values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static char Char(object value)
        {
            try
            {
                return value is char ? (char)value : value != null ? (char)value : ' ';
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static char Char(System.Data.IDataReader reader, MapPoint mapPoint, char defaultValue = ' ')
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetChar(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static char Char(object[] values, MapPoint mapPoint, char defaultValue = ' ')
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (char)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static TimeSpan TimeSpan(object value)
        {
            try
            {
                return value is TimeSpan ? (TimeSpan)value : value != null ? 
                    (TimeSpan)Convert.ChangeType(value, typeof(TimeSpan)): System.TimeSpan.MinValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static TimeSpan TimeSpan(System.Data.IDataReader reader, MapPoint mapPoint, TimeSpan defaultValue)
        {
            try
            {
                var sql = (System.Data.SqlClient.SqlDataReader)reader;
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? sql.GetTimeSpan(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static TimeSpan TimeSpan(object[] values, MapPoint mapPoint, TimeSpan defaultValue)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (TimeSpan)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static DateTime DateTime(object value)
        {
            try
            {
                return value is DateTime ? (DateTime)value : value != null ? Convert.ToDateTime(value) : System.DateTime.MinValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static DateTime DateTime(System.Data.IDataReader reader, MapPoint mapPoint, DateTime defaultValue)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetDateTime(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static DateTime DateTime(object[] values, MapPoint mapPoint, DateTime defaultValue)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (DateTime)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static decimal Decimal(object value)
        {
            try
            {
                return value is decimal ? (decimal)value : value != null ? Convert.ToDecimal(value) : (decimal)0;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static decimal Decimal(System.Data.IDataReader reader, MapPoint mapPoint, decimal defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetDecimal(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static decimal Decimal(object[] values, MapPoint mapPoint, decimal defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value? (decimal)values[mapPoint.Index]:defaultValue;
            }
            catch (Exception)
            {
                throw;
            }            
        }

        public static double Double(object value)
        {
            try
            {
                return value is double ? (double)value : value != null ? Convert.ToDouble(value) : (double)0;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static double Double(System.Data.IDataReader reader, MapPoint mapPoint, double defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetDouble(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static double Double(object[] values, MapPoint mapPoint, double defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (double)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }            
        }

        public static V Enum<V>(object value)
        {
            if (value != null)
            {
                try
                {
                    return (V)System.Enum.Parse(typeof(V), value.ToString());
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return default(V);
        }

        public static V Enum<V>(System.Data.IDataReader reader, MapPoint mapPoint, V defaultValue)
        {
            try
            {
                if (mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index))
                {
                    return (V)System.Enum.Parse(typeof(V), reader.GetValue(mapPoint.Index).ToString());
                }
            }
            catch (Exception)
            {
                throw;
            }
            return defaultValue;
        }

        public static V Enum<V>(object[] values, MapPoint mapPoint, V defaultValue)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (V)System.Enum.Parse(typeof(V), values[mapPoint.Index].ToString()) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static Guid Guid(object value)
        {
            try
            {
                return value is Guid ? (Guid)value : value != null ? new System.Guid(value.ToString()) : System.Guid.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static Guid Guid(System.Data.IDataReader reader, MapPoint mapPoint, Guid defaultValue)
        {
            try
            {
                if (mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index))
                {
                    if (mapPoint.Type == System.Data.SqlDbType.UniqueIdentifier)
                    {
                        return reader.GetGuid(mapPoint.Index);
                    }
                    else
                    {
                        return new Guid(reader.GetValue(mapPoint.Index).ToString());
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return defaultValue;
        }

        public static Guid Guid(object[] values, MapPoint mapPoint, Guid defaultValue)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (Guid)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }            
        }

        public static int Int(object value)
        {
            try
            {
                return value is int ? (int)value : value != null ? Convert.ToInt32(value) : 0;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static int Int(System.Data.IDataReader reader, MapPoint mapPoint, int defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetInt32(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static int Int(object[] values, MapPoint mapPoint, int defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value?(int)values[mapPoint.Index]:defaultValue;
            }
            catch (Exception)
            {
                throw;
            }            
        }

        public static Int64 Long(object value)
        {
            try
            {
                return value is Int64 ? (Int64)value : value != null ? Convert.ToInt64(value) : 0;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static Int64 Long(System.Data.IDataReader reader, MapPoint mapPoint, Int64  defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetInt64(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static Int64 Long(object[] values, MapPoint mapPoint, Int64 defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (Int64)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static short Short(object value)
        {
            try
            {                
                return value is short ? (short)value : value != null ? Convert.ToInt16(value) : (short)0;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static short Short(System.Data.IDataReader reader, MapPoint mapPoint, short defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetInt16(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static short Short(object[] values, MapPoint mapPoint, short defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (short)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static Single Single(object value)
        {
            try
            {
                return value is Single ? (Single)value : value != null ? Convert.ToSingle(value) : (Single)0;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static Single Single(System.Data.IDataReader reader, MapPoint mapPoint, Single defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetFloat(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static Single Single(object[] values, MapPoint mapPoint, Single defaultValue = 0)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value ? (Single)values[mapPoint.Index] : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string String(object value)
        {
            try
            {
                return value is string ? (string)value : value != null ? value.ToString() : System.String.Empty;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string String(System.Data.IDataReader reader, MapPoint mapPoint, string defaultValue = null)
        {
            try
            {
                return mapPoint.IsInResultSet() && !reader.IsDBNull(mapPoint.Index) ? reader.GetString(mapPoint.Index) : defaultValue;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static string String(object[] values, MapPoint mapPoint, string defaultValue = null)
        {
            try
            {
                return mapPoint.IsInResultSet() && values[mapPoint.Index] != DBNull.Value?(string)values[mapPoint.Index]:defaultValue;
            }
            catch (Exception)
            {
                throw;
            }            
        }

    }
}
