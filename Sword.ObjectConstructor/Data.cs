using Sword.Objects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sword.ObjectConstructor
{
    public static class Data
    {

        public static bool Initialized()
        {
            //look for settings on meta data connection
            //for now just use what have for testing against vdev001 IT
            return true;
        }

        private static List<ProjectObject> m_Projects;
        public static List<ProjectObject> Projects
        {
            get
            {
                if (m_Projects == null)
                {
                    m_Projects = Dbo.Procs.Project_Get.ToList<ProjectObject>();
                }
                return m_Projects;
            }
            set { m_Projects = value; }
        }

        private static List<ConnectionObject> m_Connections;
        public static List<ConnectionObject> Connections
        {
            get { 
                if(m_Connections==null)
                {
                    m_Connections = Dbo.Procs.Connection_Get.ToList<ConnectionObject>();
                }
                return m_Connections; }
            set { m_Connections = value; }
        }
                


    }
}
