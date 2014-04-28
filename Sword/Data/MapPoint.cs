using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using d= System.Data;

namespace Sword
{
    public class MapPoint
    {
        private int m_Index = -1;
        public int Index
        {
            get { return m_Index; }
            set { m_Index = value; }
        }

        private d.SqlDbType m_Type;
        public d.SqlDbType Type
        {
            get { return m_Type; }
            set { m_Type = value; }
        }

        public bool IsInResultSet()
        {
            return this.Index > -1;
        }
    }
}
