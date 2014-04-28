using System.Collections.Generic;
using d = System.Data;

namespace Sword
{
    /// <summary>
    /// Interface for the FillResultSet Method
    /// </summary>
    public interface IResultSet
    {
        /// <summary>
        /// the count of matches from a readers fields
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        int ReaderColumnMatchCount(d.IDataReader reader);
        /// <summary>
        /// use the reader to fill this ISwordObject's ReturnData
        /// </summary>
        /// <param name="reader"></param>
        void FillData(d.IDataReader reader);
        /// <summary>
        /// defaulted to False,  if used in reader for multiple queries change to true
        /// </summary>
        bool AllowFillFromMultipleQueries { get; set; }
        /// <summary>
        /// defaulted to false, on useage by one query set to true
        /// if you reuse the ISwordObject[] you should reset this accordingly
        /// </summary>
        bool HasBeenUsed { get; set; }
    }

    public class IResultSet<T> : IResultSet
        where T : class, IDynamic, new()
    {

        /// <summary>
        /// Constructor when list is supplied
        /// </summary>
        /// <param name="fillList"></param>
        public IResultSet(IList<T> fillList)
        {
            this.ReturnValues = fillList;
        }

        /// <summary>
        /// Constructor when no list is supplied
        /// </summary>
        public IResultSet()
        {
            ReturnValues = new List<T>();
        }

        /// <summary>
        /// the filled List of type T
        /// </summary>
        public IList<T> ReturnValues { get; set; }

        #region ISwordObject Members

        /// <summary>
        /// the count of matches from a readers fields
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        public int ReaderColumnMatchCount(d.IDataReader reader)
        {
            if (HasBeenUsed && !AllowFillFromMultipleQueries)
            {
                return 0;
            }
            int ret = 0;
            var obj = new T();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                ret += obj.HasProperty(reader.GetName(i)) ? 1 : 0;
            }
            return ret;
        }

        /// <summary>
        /// use the reader to fill this ISwordObject's ReturnData
        /// </summary>
        /// <param name="reader"></param>
        public void FillData(d.IDataReader reader)
        {
            var cache = new List<ReaderCache>();
            Dictionary<string, MapPoint> staticallyTypedMap;
            Dictionary<string, MapPoint> dynamicallyTypedMap;
            Data.setMaps(new T(), reader, out staticallyTypedMap, out dynamicallyTypedMap);
            while (reader.Read())
            {
                HasBeenUsed = true;
                T newObject = new T();
              //  Data.SetAsLoading(newObject);
                newObject.SetValues(reader, staticallyTypedMap, dynamicallyTypedMap);
                //Data.setValueFromReader(newObject, reader, cache);                
                ReturnValues.Add(newObject);
            }
            //foreach (var item in ReturnValues)
            //{
            //    Data.AcceptChanges(item);
            //}
        }

        private bool m_OccursInResultSetMoreThanOnce = false;
        /// <summary>
        /// Setting this allow file from mulitple queries 
        /// means if this object has already been used in a reader execute it will be allowed to be used again
        /// </summary>
        public bool AllowFillFromMultipleQueries
        {
            get { return m_OccursInResultSetMoreThanOnce; }
            set { m_OccursInResultSetMoreThanOnce = value; }
        }

        private bool m_HasBeenUsed = false;
        /// <summary>
        /// indicates whether the object has been used by ready
        /// </summary>
        public bool HasBeenUsed
        {
            get { return m_HasBeenUsed; }
            set { m_HasBeenUsed = value; }
        }

        #endregion
    }
}
