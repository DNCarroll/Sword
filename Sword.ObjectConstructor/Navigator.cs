using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace Sword.ObjectConstructor
{
    public static class Navigator
    {

        private static Frame m_MainFrame;
        public static Frame MainFrame
        {
            get { return m_MainFrame; }
            set { m_MainFrame = value; }
        }

        public static MainWindow MainWindow { get; set; }

        public static void Initialize(Frame mainFrame, MainWindow main)
        {
            MainFrame = mainFrame;
            MainWindow = main;
        }

        //not sure gonna worry about this just yet
        public static void Back()
        {

        }

        public static void To(this Page page, Page content, object data = null)
        {
            To(content, data);
        }

        public static void To(Page content, object data = null)
        {
            MainFrame.Navigate(content, data);
            if (data != null)
            {
                content.DataContext = data;
            }
        }
    }
}
