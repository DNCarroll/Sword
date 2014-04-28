using System;
using System.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Reflection;
using System.Web.Script.Serialization;

namespace Sword.Serialization
{
    /// <summary>
    /// 
    /// </summary>
    public static class JsonExt
    {
        
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ToJson<T>(this T obj)
            where T : class, IDynamic, new()
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.RegisterConverters(

                new JavaScriptConverter[] { 
                        new Json<T>() });
            return serializer.Serialize(obj);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ToJson<T>(this List<T> obj)
            where T : class, IDynamic, new()
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.RegisterConverters(

                new JavaScriptConverter[] { 
                        new Json<T>() });
            return serializer.Serialize(obj);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <param name="properties"></param>
        /// <returns></returns>
        public static string ToJsonString<T>(this T obj, string[] properties)
            where T : class, IDynamic, new()
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Json<T> converter = new Json<T>();
            converter.Fields = properties;
            serializer.RegisterConverters(
                new JavaScriptConverter[] { 
                        converter });
            return serializer.Serialize(obj);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ToJson<T>(this IEnumerable<T> obj)
            where T : class, IDynamic, new()
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.RegisterConverters(

                new JavaScriptConverter[] { 
                        new Json<T>() });
            return serializer.Serialize(obj);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <param name="properties"></param>
        /// <returns></returns>
        public static string ToJson<T>(this IEnumerable<T> obj, string[] properties)
            where T : class, IDynamic, new()
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Json<T> converter = new Json<T>();
            converter.Fields = properties;
            serializer.RegisterConverters(
                new JavaScriptConverter[] { 
                        converter });
            return serializer.Serialize(obj);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public static List<T> JsonToList<T>(this string json)
            where T : class, IDynamic, new()
        {

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            //serializer.RegisterConverters(

            //    new JavaScriptConverter[] { 
            //            new Json<T>() });
            return serializer.Deserialize<List<T>>(json);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public static T JsonToObject<T>(this string json)
            where T : class, new()
        {
            json = json.Replace("\"01-01-01", "\"0001-01-01");
            return new JavaScriptSerializer().Deserialize<T>(json);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string SerializeBase<T>(this T obj)
            where T : class, new()
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(obj);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="json"></param>
        /// <returns></returns>
        public static List<T> DeserializeBase<T>(this string json)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Deserialize<List<T>>(json);
        }
    }

    /// <summary>
    /// 
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Json<T> : JavaScriptConverter
        where T : class, IDynamic, new()
    {


        private string[] m_Fields;
        /// <summary>
        /// 
        /// </summary>
        public string[] Fields
        {
            get
            {
                if (m_Fields == null)
                {
                    m_Fields = serializeProperties().ToArray();
                }
                return m_Fields;
            }
            set { m_Fields = value; }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objs"></param>
        /// <returns></returns>
        public static string Serialize(List<T> objs)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            serializer.RegisterConverters(

                new JavaScriptConverter[] { 
                        new Json<T>() });
            return serializer.Serialize(objs);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="dictionary"></param>
        /// <param name="type"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
        {
            var obj = new T();
            foreach (KeyValuePair<string, object> item in dictionary)
            {
                try
                {
                    obj[item.Key] = item.Value;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return obj;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="serializer"></param>
        /// <returns></returns>
        public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
        {
            return SerializeObject(obj);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        private IDictionary<string, object> SerializeObject(object obj)
        {
            IDictionary<string, object> values = new Dictionary<string, object>();
            foreach (var item in Fields)
            {
                var value = ((T)obj)[item];
                if (value is DateTime)
                {

                    //                    values.Add(item, ((DateTime)value).ToString("yyyy-MM-ddTHH:mm:ssZ");
                    //            //        this.getUTCFullYear()   + '-' +
                    //          //          f(this.getUTCMonth() + 1) + '-' +
                    //        //            f(this.getUTCDate())      + 'T' +
                    //      //              //f(this.getUTCDate())      + ' ' +
                    //    //                f(this.getUTCHours())     + ':' +
                    //  //                  f(this.getUTCMinutes())   + ':' +
                    ////                    f(this.getUTCSeconds())   + 'Z'


                    TimeSpan ts = (DateTime)value - DateTime.Parse("1/1/1970");
                    values.Add(item, "Date(" + ts.TotalMilliseconds.ToString() + ")");
                }
                else
                {
                    values.Add(item, value == null ? "" : value);
                }
            }
            return values;
        }

        /// <summary>
        /// 
        /// </summary>
        public override IEnumerable<Type> SupportedTypes
        {
            get
            {
                return new ReadOnlyCollection<Type>(new List<Type>(new Type[] { typeof(T) }));
            }
        }

        //may be an issue
        List<string> serializeProperties()
        {
            List<string> serializableProperties = new List<string>();
            var SwordItem = new T();
            //enumerate attributes
            //need properties
            var BaseType = SwordItem.GetType();
            List<System.Reflection.PropertyInfo> properties = new List<System.Reflection.PropertyInfo>();
            properties.AddRange(BaseType.GetProperties());

            var tempProps = SwordItem.PropertyNames().ToList();
            foreach (PropertyInfo item in properties)
            {
                if (!item.PropertyType.IsGenericParameter)
                {
                    var attr = Attribute.GetCustomAttribute(item, typeof(System.Web.Script.Serialization.ScriptIgnoreAttribute)) as System.Web.Script.Serialization.ScriptIgnoreAttribute;
                    if (attr == null)
                    {
                        serializableProperties.Add(item.Name);
                        if (tempProps.Contains(item.Name))
                        {
                            tempProps.Remove(item.Name);
                        }
                    }
                }
            }
            serializableProperties.AddRange(tempProps.ToArray());
            return serializableProperties;

        }

    }

    

    public class DynamicSwordSerializer : JavaScriptConverter
    {

        public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
        {
            IDynamic obj = null;
            if (type == typeof(DynamicSword))
            {
                obj = new DynamicSword();
            }
            else
            {             
                var temp = Activator.CreateInstance(type, null);
                if (temp is IDynamic)
                {
                    obj = (IDynamic)temp;
                }
            }

            if (obj != null)
            {
                foreach (KeyValuePair<string, object> item in dictionary)
                {
                    try
                    {
                        obj[item.Key] = item.Value;
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }
            return obj;
        }

        //not sure about the date handling here
        public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
        {
            IDictionary<string, object> values = new Dictionary<string, object>();
            if (obj is IDynamic)
            {
                IDynamic idynamicObj = (IDynamic)obj;
                var properties = idynamicObj.GetDynamicMemberNames().ToList();
                var staticProperties = idynamicObj.SerializableProperties();
                if (staticProperties != null)
                {
                    properties.AddRange(staticProperties);
                }
                //not sure how enums will be handled
                //strings and numbers should be ok
                foreach (var item in properties)
                {
                    var value = idynamicObj[item];                    
                    values.Add(item, value);
                }
            }
            return values;
        }

        public override IEnumerable<Type> SupportedTypes
        {
            get { return new ReadOnlyCollection<Type>(new List<Type>(new Type[] { typeof(DynamicSword), typeof(IDynamic) })); }
        }
    }
}
