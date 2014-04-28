using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;

namespace Sword
{

    //IDynamic exists on its own?
    //ISword is IDynamic?
    //ISword implements same properties as IDynamic
    //Sword class implements a Dynamic class?
    public interface IDynamic
    {
        object this[string property] { get; set; }
        string[] PropertyNames();
        void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> staticallyTypedMap, Dictionary<string, MapPoint> dynamicProperties);
        string[] GetStaticallyTypedPropertyNames();
        bool HasProperty(string property);
    }

    /// <summary>
    /// Warning if you indent to set or get statically defined properties you should 
    /// implement GetValue, SetValue, SetValues, & GetStaticallyTypedPropertyNames for example if you are reading from a datareader and setting a 
    /// property predefined in the object
    /// </summary>
    public abstract class SwordAbstract : DynamicObject, IDynamic
    {
        public virtual object GetValue(string property)
        {
            return null;
        }

        public virtual void SetValue(string property, object value)
        {
        }

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
            return dictionary.TryGetValue(name, out result);
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
        }

        public string[] PropertyNames()
        {
            var ret = new List<string>();
            ret.AddRange(dictionary.Keys.ToArray());
            ret.AddRange(this.GetStaticallyTypedPropertyNames());
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
            return properties!= null && properties.FirstOrDefault(p => p == property) != null;
        }
    }

    public class DynamicSword : SwordAbstract
    {
    }

}
