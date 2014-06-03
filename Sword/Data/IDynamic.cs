using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;

namespace Sword
{

    public interface IDynamic
    {
        object this[string property] { get; set; }
        string[] PropertyNames();
        void SetValues(object[] values, Dictionary<string, MapPoint> map);
        void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> staticallyTypedMap, Dictionary<string, MapPoint> dynamicProperties);
        string[] GetStaticallyTypedPropertyNames();
        bool HasProperty(string property);
        string Table { get; }
        string ObjectConnectionString { get; }
        string[] TableFields();
        string[] SerializableProperties();        
        void SetSerializableAndNotSerializable(out string[] serializable, out string[] notSerializable);
        Type GetPropertyType(string propertyName);
        IEnumerable<string> GetDynamicMemberNames();        
    }

    public abstract class SwordAbstract : DynamicObject, IDynamic
    {

        public void SetSerializableAndNotSerializable(out string[] serializable, out string[] notSerializable)
        {
            var ret = new List<string>();
            var staticSerializable = SerializableProperties();
            ret.AddRange(dictionary.Keys.ToArray());
            ret.AddRange(staticSerializable);
            serializable = ret.ToArray();
            notSerializable = GetStaticallyTypedPropertyNames().Where(s => !staticSerializable.Contains(s)).ToArray();
        }

        public virtual Type GetPropertyType(string field)
        {
            return null;
        }

        public virtual string[] TableFields()
        {
            return null;
        }

        public virtual string Table
        {
            get
            {
                return null;
            }
        }

        public virtual string ObjectConnectionString
        {
            get
            {
                return null;
            }
        }

        public virtual object GetValue(string property)
        {
            return null;
        }

        public virtual void SetValue(string property, object value)
        {
        }

        public virtual void SetValues(object[] values, Dictionary<string, MapPoint> map) { }

        public virtual void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map) { }

        public virtual string[] GetStaticallyTypedPropertyNames()
        {
            return null;
        }

        Dictionary<string, object> dictionary = new Dictionary<string, object>();
        public object this[string property]
        {
            get
            {
                object result = GetValue(property);
                if (result == null)
                {
                    this.dictionary.TryGetValue(property, out result);
                }
                return result;
            }
            set
            {
                var properties = this.GetStaticallyTypedPropertyNames();
                if (properties != null && properties.FirstOrDefault(p => p == property) != null)
                {
                    this.SetValue(property, value);
                }
                else
                {
                    dictionary[property] = value;
                }
            }
        }

        // If you try to get a value of a property 
        // not defined in the class, this method is called.
        public override bool TryGetMember(
            System.Dynamic.GetMemberBinder binder, out object result)
        {
            // Converting the property name to lowercase
            // so that property names become case-insensitive.
            string name = binder.Name;

            // If the property name is found in a dictionary,
            // set the result parameter to the property value and return true.
            // Otherwise, return false.
            var ret = dictionary.TryGetValue(name, out result);
            if (!ret)
            {
                result = null;
            }
            return true;
        }

        // If you try to set a value of a property that is
        // not defined in the class, this method is called.
        public override bool TrySetMember(
            System.Dynamic.SetMemberBinder binder, object value)
        {
            // Converting the property name to lowercase
            // so that property names become case-insensitive.
            dictionary[binder.Name] = value;

            // You can always add a value to a dictionary,
            // so this method always returns true.
            return true;
        }

        /// <summary>
        /// If a property value is a delegate, invoke it
        /// </summary>     
        public override bool TryInvokeMember
           (InvokeMemberBinder binder, object[] args, out object result)
        {
            if (dictionary.ContainsKey(binder.Name)
                      && dictionary[binder.Name] is Delegate)
            {
                result = (dictionary[binder.Name] as Delegate).DynamicInvoke(args);
                return true;
            }
            else
            {
                return base.TryInvokeMember(binder, args, out result);
            }
        }


        

        /// <summary>
        /// Return all dynamic member names
        /// </summary>
        /// <returns>
        public override IEnumerable<string> GetDynamicMemberNames()
        {
            return dictionary.Keys;
            //var ret = new List<string>();
            //ret.AddRange(dictionary.Keys.ToArray());
            //var staticNames = this.SerializableProperties();
            //if (staticNames != null)
            //{
            //    ret.AddRange(staticNames);
            //}
            //return ret.ToArray();
        }

        public string[] PropertyNames()
        {
            var ret = new List<string>();
            ret.AddRange(dictionary.Keys.ToArray());
            var staticNames = this.GetStaticallyTypedPropertyNames();
            if (staticNames != null)
            {
                ret.AddRange(staticNames);
            }
            return ret.ToArray();
        }

        public void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> staticallyTypedMap, Dictionary<string, MapPoint> dynamicProperties)
        {
            SetValues(reader, staticallyTypedMap);
            foreach (var item in dynamicProperties)
            {
                this[item.Key] = reader.GetValue(item.Value.Index);
            }
        }

        public bool HasProperty(string property)
        {
            var properties = this.GetStaticallyTypedPropertyNames();
            return
                (
                    properties != null && properties.FirstOrDefault(p => p == property) != null
                ) ||
                (
                    dictionary != null && dictionary.ContainsKey(property)
                );
        }

        public virtual string[] SerializableProperties()
        {   
            return new string[] {                
            };
        }

        /// <summary>
        /// removes properties from the object
        /// </summary>
        /// <param name="properties"></param>
        /// <returns></returns>
        public bool Delete(params string[] properties)
        {
            var ret = false;
            if (properties != null && properties.Length > 0)
            {
                foreach (var property in properties)
                {
                    if (dictionary.ContainsKey(property))
                    {
                        dictionary.Remove(property);
                        ret = true;
                    }
                }
            }
            return ret;
        }

    }

    public class DynamicSword : SwordAbstract, IDisposable
    {
        public DynamicSword Set(string fieldToSet, DynamicSword source, Func<DynamicSword, bool> where)
        {
            if (where(source))
            {
                this[fieldToSet] = source[fieldToSet];
            }
            return this;
        }

        public DynamicSword()
        {          
        }

        public DynamicSword(Dictionary<string, object> properties)
        {            
            foreach (KeyValuePair<string, object> item in properties)
            {
                this[item.Key] = item.Value;
            }
        }

        public void Dispose()
        {
            var props = this.PropertyNames();
            foreach (var item in props)
            {
                var obj = this[item];
                if (!obj.GetType().IsValueType)
                {
                    this[item] = null;
                }
            }
        }
    }


    public class DynamicSwordConverter : JsonConverter
    {

        public override bool CanConvert(Type objectType)
        {
            return objectType.BaseType == typeof(DynamicSword);
        }

        public override object ReadJson(JsonReader reader,
                                        Type objectType,
                                         object existingValue,
                                         JsonSerializer serializer)
        {
            var newObject = constructObject(objectType);
            JObject jObject = JObject.Load(reader);
            if (newObject is DynamicSword)
            {
                var ds = (DynamicSword)newObject;
                hydrate(jObject, ds);
            }
            else
            {
                //do something different?
                //really shoulnt be in here anyways
            }
            return newObject;
        }

        object constructObject(Type type)
        {
            ConstructorInfo magicConstructor = type.GetConstructor(Type.EmptyTypes);
            return magicConstructor.Invoke(new object[] { });
        }

        void hydrate(JObject jObject, DynamicSword obj)
        {
            string[] serializable;
            string[] notSerializable;
            obj.SetSerializableAndNotSerializable(out serializable, out notSerializable);
            foreach (KeyValuePair<string, JToken> item in jObject)
            {
                if (serializable.Contains(item.Key))
                {
                    var type = obj.GetPropertyType(item.Key);
                    if (type != null)
                    {
                        if (type.IsValueType || type == typeof(string))
                        {
                            obj[item.Key] = item.Value;
                        }
                        else if (type.BaseType == typeof(DynamicSword) && item.Value is JObject)
                        {
                            var childJObject = (JObject)item.Value;
                            if (obj[item.Key] == null)
                            {
                                obj[item.Key] = constructObject(type);
                            }
                            hydrate(childJObject, (DynamicSword)obj[item.Key]);
                        }
                        else
                        {
                            obj[item.Key] = constructObject(type);
                            if (obj[item.Key] != null)
                            {
                                if (obj[item.Key] is IList && item.Value is JArray && type.IsGenericType)
                                {
                                    var jArray = ((JArray)item.Value).Children();
                                    var list = (IList)obj[item.Key];
                                    Type subType = list.GetType().GetGenericArguments()[0];
                                    var isDynamicSword = subType.BaseType == typeof(DynamicSword);
                                    if (isDynamicSword)
                                    {
                                        foreach (var subItem in jArray)
                                        {
                                            if (subItem is JObject)
                                            {
                                                var newSubObject = (DynamicSword)constructObject(subType);
                                                hydrate((JObject)subItem, newSubObject);
                                                list.Add(newSubObject);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (!notSerializable.Contains(item.Key))
                {
                    obj[item.Key] = item.Value;
                }
            }
        }

        public override void WriteJson(JsonWriter writer,
                                       object value,
                                       JsonSerializer serializer)
        {
            if (value is DynamicSword)
            {
                var ds = (DynamicSword)value;
                string[] serializable;
                string[] notSerializable;
                ds.SetSerializableAndNotSerializable(out serializable, out notSerializable);
                var jobject = new JObject();
                foreach (var item in serializable)
                {
                    var tempValue = ds[item];
                    if (tempValue != null)
                    {
                        jobject.Add(item, JToken.FromObject(tempValue));
                    }
                }
                jobject.WriteTo(writer);
            }
            else
            {
                JToken t = JToken.FromObject(value);
                t.WriteTo(writer);
            }
        }
    }

}
