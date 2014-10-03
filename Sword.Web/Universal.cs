using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sword.Web
{
    public static class Universal
    {

        private static DynamicTable m_ProjectProcedures = new DynamicTable("ProjectProcedures", Universal.ConnectionString);
        public static DynamicTable ProjectProcedures
        {
            get { return m_ProjectProcedures; }
            set { m_ProjectProcedures = value; }
        }

        private static DynamicTable m_Parameters = new DynamicTable("Parameters", Universal.ConnectionString);
        public static DynamicTable Parameters
        {
            get { return m_Parameters; }
            set { m_Parameters = value; }
        }
                

        private static DynamicTable m_Procedures = new DynamicTable("Procedures", Universal.ConnectionString);
        public static DynamicTable Procedures
        {
            get { return m_Procedures; }
            set { m_Procedures = value; }
        }

        private static DynamicTable m_Enums = new DynamicTable("Enums", Universal.ConnectionString);
        public static DynamicTable Enums
        {
            get { return m_Enums; }
            set { m_Enums = value; }
        }

        private static DynamicTable m_Fields = new DynamicTable("Fields", Universal.ConnectionString);
        public static DynamicTable Fields
        {
            get { return m_Fields; }
            set { m_Fields = value; }
        }

        private static DynamicTable m_Objects = new DynamicTable("Objects", Universal.ConnectionString);
        public static DynamicTable Objects
        {
            get { return m_Objects; }
            set { m_Objects = value; }
        }

        private static DynamicTable m_ConnectionsStrings = new DynamicTable("ConnectionStrings", Universal.ConnectionString);
        public static DynamicTable ConnectionsStrings
        {
            get {                
                return m_ConnectionsStrings; 
            }
            set { m_ConnectionsStrings = value; }
        }       

        private static DynamicTable m_Connections = new DynamicTable("Connections", Universal.ConnectionString);
        public static DynamicTable Connections
        {
            get { return m_Connections; }
            set { m_Connections = value; }
        }

        private static DynamicTable m_ProjectsTable = new DynamicTable("Projects", Universal.ConnectionString);
        public static DynamicTable Projects
        {
            get { return m_ProjectsTable; }
            set { m_ProjectsTable = value; }
        }
                

        private static List<ViewInfo> m_views = new List<ViewInfo>();
        public static List<ViewInfo> Views
        {
            get { return m_views; }
            set { m_views = value; }
        }

        public static string ConnectionString()
        {
            //if (Environment.MachineName == "TECH028")
            //{
            //    return "Data Source=TECH028;Initial Catalog=ObjectModel;Integrated Security=True";
            //}
            return "Data Source=VDEV001;Initial Catalog=IT;Integrated Security=True";
        }

    }
}