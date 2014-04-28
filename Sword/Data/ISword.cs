using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;

namespace Sword
{
    //public interface ISword
    //{
    //    object GetValue(string propertyName);
    //    void SetValue(string propertyName, object value);
    //    string[] PrimaryKeys { get; }
    //    string Table{get; }
    //    string ObjectConnectionString { get; }
    //    bool CanDelete();
    //    bool CanInsert();
    //    string ScopeIdentity();
    //    void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map);
    //    bool HasProperty(string propertyName);
    //    string[] PropertyNames();
    //    string[] TableFields();
    //}

    public enum SwordState
    {
        /// <summary>
        /// in process of Loading
        /// </summary>
        Loading = 0,
        /// <summary>
        /// a newly created object
        /// </summary>
        New = 1,
        /// <summary>
        /// an object is current, no changes
        /// </summary>
        Current = 2,
        /// <summary>
        /// an object is dirty and has updates
        /// </summary>
        Dirty = 3,
        /// <summary>
        /// an object is marked for delete
        /// </summary>
        MarkedForDelete = 4,
        /// <summary>
        /// Record insert failed already exists
        /// </summary>
        DuplicationViolation = 500,
        /// <summary>
        /// a Concurrency update violation
        /// </summary>
        ConcurrencyUpdateViolation = 1000

    }

    public interface ISwordState : INotifyPropertyChanged
    {
        SwordState ObjectState { get; set; }        
        void AcceptChanges();
        string ChangingProperty { get; set; }               
    }

    public abstract class SwordObject : IDynamic, ISwordState
    {

        public virtual void SetValues(object[] values, Dictionary<string, MapPoint> map) { }
        //public virtual void SetValue(string propertyName, byte[] value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, Guid value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, byte value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, short value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, bool value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, long value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, int value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, double value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, string value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, Single value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, DateTime value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}
        //public virtual void SetValue(string propertyName, decimal value)
        //{
        //    this.SetValue(propertyName, (object)value);
        //}


        public SwordObject()
        {
        }
        public virtual bool CanInsert() { return false; }
        public virtual string ScopeIdentity() { return null; }
        public virtual bool CanDelete() { return false; }

        public object this[string propertyName]
        {
            get
            {
                return GetValue(propertyName);
            }
            set
            {
                this.SetValue(propertyName, value);
            }
        }
        public virtual string[] TableFields() { return null; }
        public abstract string[] PrimaryKeys { get; }
        public abstract string Table { get; }
        public abstract object GetValue(string propertyName);
        public abstract void SetValue(string propertyName, object value);
        public abstract void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> map);
        public abstract bool HasProperty(string propertyName);
        public virtual System.Data.SqlClient.SqlCommand Insert { get{ return null;} }
        public virtual System.Data.SqlClient.SqlCommand Update { get { return null; } }

        #region ISwordState

        private SwordState m_ObjectState = SwordState.New;
        public SwordState ObjectState
        {
            get { return m_ObjectState; }
            set
            {
                if (this.ObjectState != SwordState.Loading)
                {
                    if (m_ObjectState != SwordState.New || value == SwordState.Loading)
                    {
                        m_ObjectState = value;
                    }
                    OnNotifyChanged();
                    if (m_ObjectState == SwordState.New)
                    {
                        var insert = this.Insert;
                        if (insert != null)
                        {
                            this.m_ObjectState = SwordState.Loading;
                            this.Execute(insert);                            
                        }
                    }
                    else if (m_ObjectState == SwordState.Dirty)
                    {
                        var update = this.Update;
                        if (update != null)
                        {
                            this.m_ObjectState = SwordState.Loading;
                            this.Execute(update);
                        }
                    }
                }
            }
        }

        public void OnNotifyChanged()
        {
            if (this.PropertyChanged != null)
            {
                this.PropertyChanged(this, new PropertyChangedEventArgs(ChangingProperty));
            }
        }

        public void AcceptChanges()
        {
            m_ObjectState = SwordState.Current;
        }

        private string m_ChangingProperty;
        //        [System.Xml.Serialization.XmlIgnoreAttribute]
        //[ScriptIgnore]
        public string ChangingProperty
        {
            get { return m_ChangingProperty; }
            set { m_ChangingProperty = value; }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        #endregion

        public abstract string[] PropertyNames();

        public abstract string ObjectConnectionString { get; }


        public void SetValues(System.Data.IDataReader reader, Dictionary<string, MapPoint> staticallyTypedMap, Dictionary<string, MapPoint> dynamicProperties)
        {
            SetValues(reader, staticallyTypedMap);
            foreach (var item in dynamicProperties)
            {
                this[item.Key] = reader.GetValue(item.Value.Index);
            }
        }

        public string[] GetStaticallyTypedPropertyNames()
        {
            return PropertyNames();
        }


        public string[] SerializableProperties()
        {
            return null;
        }


        public IEnumerable<string> GetDynamicMemberNames()
        {
            return new List<string>();
        }

    }
}
