using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Xml.Serialization;

namespace Sword.Serialization
{
    /// <summary>
    /// this needs customization like Json and Delim
    /// </summary>
    public static class Xml
    {


        private static bool m_ThrowFromException = false;
        /// <summary>
        /// = true means exception will be thrown if there is an exception during string conversion or object conversion
        /// </summary>
        public static bool ThrowFromException
        {
            get { return m_ThrowFromException; }
            set { m_ThrowFromException = value; }
        }

        /// <summary>
        /// extension method to get to xml string for given object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ToXml<T>(this T obj) where T : class
        {

            try
            {
                string xml;
                MemoryStream stream = new MemoryStream();
                XmlSerializer serializer = new XmlSerializer(obj.GetType());
                serializer.Serialize(stream, obj);
                xml = System.Text.Encoding.UTF8.GetString(stream.ToArray(), 0, Convert.ToInt32(stream.Length));
                stream.Close();
                return xml;
            }
            catch(Exception ex)
            {
                if (ThrowFromException)
                {
                    throw ex;
                }
            }
            finally { }
            return null;
        }

        /// <summary>
        /// Converts and xml object of T to string xml      
        /// set ThrowFromException = true if you are having a xml conversion issue
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="xml"></param>
        /// <returns></returns>
        public static T FromXml<T>(this string xml) where T : class, new()
        {

            try
            {
                //ive seen it give this ﻿﻿character on occasion
                xml = xml.Replace("﻿<?xml version=\"1.0\" encoding=\"utf-8\"?>", "<?xml version=\"1.0\" encoding=\"utf-8\"?>");
                T entity = new T();
                StringReader reader = null;
                try
                {
                    System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(entity.GetType());
                    reader = new StringReader(xml);
                    entity = (T)serializer.Deserialize(reader);
                }
                finally
                {
                    if (reader != null) reader.Close();
                }

                return entity;
            }
            catch (Exception ex)
            {
                if (ThrowFromException)
                {
                    throw ex;
                }
            }
            finally { }

            return default(T);
        }

        /// <summary>
        /// Removes namespace from the ToXml Return
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static string ToXmlRemoveXmlNs<T>(T obj) where T : class
        {
            return ToXml(obj).Replace("xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"", "").Replace(" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"", "").Replace("<?xml version=\"1.0\"?>", "");
        }

        /// <summary>
        /// Fixes special characters within a string value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string RemoveSpecialCharacters(string value)
        {
            return value.Replace("<", "&lt;").Replace("&", "&amp;").Replace(">", "&gt;").Replace("\"", "&quot;").Replace("'", "&apos;");
        }

        /// <summary>
        /// Fixes other special characters witing string value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string RemoveSpecialCharacters2(string value)
        {
            return value.Replace("&", "&amp;").Replace("\"", "&quot;").Replace("'", "&apos;");
        }

    }
}
