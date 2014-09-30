using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sword
{
    public class TestList<T> : List<T>
    {
        public static TestList<T> operator +(TestList<T> list, T obj)
        {
            list.Add(obj);
            return list;
        }

        public static TestList<T> operator +(TestList<T> list, T[] obj)
        {
            list.AddRange(obj);
            return list;
        }

        public static TestList<T> operator +(TestList<T> list, TestList<T> other)
        {
            list.AddRange(other.ToArray());
            return list;
        }

        public static bool operator >(TestList<T> list, int count)
        {
            return list.Count > count;
        }

        public static bool operator <(TestList<T> list, int count)
        {
            return list.Count < count;
        }

        public static bool operator ==(TestList<T> list, int count)
        {
            return list.Count == count;
        }

        public static bool operator !=(TestList<T> list, int count)
        {
            return list.Count != count;
        }

        public static bool operator >=(TestList<T> list, int count)
        {
            return list.Count >= count;
        }

        public static bool operator <=(TestList<T> list, int count)
        {
            return list.Count <= count;
        }

        public static TestList<T> operator -(TestList<T> list, Func<T, bool> remove)
        {
            var pos = list.Count -1;
            while (pos > 0)
            {
                if(remove(list[pos]))
                {
                    list.Remove(list[pos]);
                }
                pos--;
            }
            return list;
        }
    }
}
