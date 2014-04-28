//depricating this wont be using Sword attributes at least not on onset unless a reason to use them arrises

//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Reflection;

//namespace Sword.Serialization
//{
//    /// <summary>
//    /// 
//    /// </summary>
//    public static class DelimExt
//    {
//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="obj"></param>
//        /// <returns></returns>
//        public static string ToDelim<T>(this object obj)
//            where T : class, ISword, new()
//        {
//            List<T> objs = new List<T>();
//            var delim = new Delim<T>();
            
//            if( obj is List<T>)
//            {
//                objs = (List<T>)obj;
//            }
//            else if(obj is T)
//            {   
//                objs.Add((T)obj);                
//            }
            
//            return delim.GetValue(objs);            
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="obj"></param>
//        /// <param name="includeHeaders"></param>
//        /// <returns></returns>
//        public static string ToDelim<T>(this object obj, bool includeHeaders)
//            where T : class, ISword, new()
//        {
//            List<T> objs = new List<T>();
//            var delim = new Delim<T>();
//            delim.IncludeColumnHeaders = includeHeaders;

//            if (obj is List<T>)
//            {
//                objs = (List<T>)obj;
//            }
//            else if (obj is T)
//            {
//                objs.Add((T)obj);
//            }

//            return delim.GetValue(objs);
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="objs"></param>
//        /// <returns></returns>
//        public static string ToDelim<T>(this List<T> objs)
//            where T : class, ISword, new()
//        {            
//            var delim = new Delim<T>();
//            return delim.GetValue(objs);
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="objs"></param>
//        /// <param name="includeHeaders"></param>
//        /// <returns></returns>
//        public static string ToDelim<T>(this List<T> objs, bool includeHeaders)
//            where T : class, ISword, new()
//        {
//            var delim = new Delim<T>();
//            delim.IncludeColumnHeaders = includeHeaders;
//            return delim.GetValue(objs);
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="objs"></param>
//        /// <returns></returns>
//        public static string ToDelim<T>(this IEnumerable<T> objs)
//            where T : class, ISword, new()
//        {
//            var delim = new Delim<T>();
//            return delim.GetValue(objs.ToList());
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="objs"></param>
//        /// <param name="includeHeaders"></param>
//        /// <returns></returns>
//        public static string ToDelim<T>(this IEnumerable<T> objs, bool includeHeaders)
//            where T : class, ISword, new()
//        {
//            var delim = new Delim<T>();
//            delim.IncludeColumnHeaders = includeHeaders;
//            return delim.GetValue(objs.ToList());
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="obj"></param>
//        /// <param name="properties"></param>
//        /// <returns></returns>
//        public static string ToDelim<T>(this IEnumerable<T> obj, string[] properties)
//            where T : class, ISword, new()
//        {            
//            var delim = new Delim<T>();
//            return delim.GetValue(obj.ToList(), properties);            
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="obj"></param>
//        /// <param name="properties"></param>
//        /// <param name="includeHeaders"></param>
//        /// <returns></returns>
//        public static string ToDelim<T>(this IEnumerable<T> obj, string[] properties, bool includeHeaders)
//            where T : class, ISword, new()
//        {            
//            var delim = new Delim<T>();
//            delim.IncludeColumnHeaders = includeHeaders;
//            return delim.GetValue(obj.ToList(), properties);
//        }


//        /// <summary>
//        /// 
//        /// </summary>
//        /// <typeparam name="T"></typeparam>
//        /// <param name="json"></param>
//        /// <returns></returns>
//        public static List<T> FromDelim<T>(this string json)
//            where T : class, ISword, new()
//        {
//            return new List<T>();            
//        }
//    }

//    /// <summary>
//    /// 
//    /// </summary>
//    /// <typeparam name="T"></typeparam>
//    public class Delim<T>
//        where T : class, ISword, new()
//    {

//        private string m_Delimiter = ",";
//        /// <summary>
//        /// 
//        /// </summary>
//        public string Delimiter
//        {
//            get { return m_Delimiter; }
//            set { m_Delimiter = value; }
//        }

//        private string m_LineDelimiter = "\r\n";
//        /// <summary>
//        /// 
//        /// </summary>
//        public string LineDelimiter
//        {
//            get { return m_LineDelimiter; }
//            set { m_LineDelimiter = value; }
//        }


//        private bool m_IncludeColumnHeaders;
//        /// <summary>
//        /// 
//        /// </summary>
//        public bool IncludeColumnHeaders
//        {
//            get { return m_IncludeColumnHeaders; }
//            set { m_IncludeColumnHeaders = value; }
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <param name="objs"></param>
//        /// <param name="fields"></param>
//        /// <returns></returns>
//        public string GetValue(List<T> objs, string[] fields)
//        {

//            var tempFields = fields.ToList();
//            if (objs.Count == 0)
//            {
//                return null;
//            }
//            List<string> lines = new List<string>();
//            if (IncludeColumnHeaders)
//            {
//                lines.Add(string.Join(this.Delimiter, fields.Select(f => "\"" + f + "\"").ToArray()));
//            }
//            foreach (var item in objs)
//            {
//                lines.Add(string.Join(this.Delimiter, tempFields.Select(f => "\"" + (item.GetValue(f) == null ? "NULL" : item.GetValue(f).ToString()) + "\"").ToArray()));
//            }

//            return string.Join(this.LineDelimiter, lines.ToArray());
//        }

//        /// <summary>
//        /// 
//        /// </summary>
//        /// <param name="objs"></param>
//        /// <returns></returns>
//        public string GetValue(List<T> objs)
//        {
//            return GetValue(objs, serializeProperties().ToArray());
//        }


//        List<string> serializeProperties()
//        {
//            List<string> serializableProperties = new List<string>();
//            var SwordItem = new T();
//            //enumerate attributes
//            //need properties
//            var BaseType = SwordItem.GetType();
//            List<System.Reflection.PropertyInfo> properties = new List<System.Reflection.PropertyInfo>();
//            properties.AddRange(BaseType.GetProperties());
//            foreach (PropertyInfo item in properties)
//            {
//                if (!item.PropertyType.IsGenericParameter)
//                {
//                    var attr = Attribute.GetCustomAttribute(item, typeof(Sword.Reflection.DelimIgnore)) as Sword.Reflection.DelimIgnore;
//                    if (attr == null)
//                    {
//                        serializableProperties.Add(item.Name);
//                    }
//                    //if (attr != null && ((attr.Serialization & Sword.Reflection.SwordSerialization.Delim) == Sword.Reflection.SwordSerialization.Delim))
//                    //{
//                    //  
//                    //}
//                }
//            }
//            return serializableProperties;

//        }

//    }
//}
