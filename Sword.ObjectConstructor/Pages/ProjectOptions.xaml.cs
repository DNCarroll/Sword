using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Sword.ObjectConstructor.Pages
{
    /// <summary>
    /// Interaction logic for ProjectOptions.xaml
    /// </summary>
    public partial class ProjectOptions : Page
    {




        private List<Objects.ObjectObject> m_Objects;
        public List<Objects.ObjectObject> Items
        {
            get { return m_Objects; }
            set { m_Objects = value; }
        }


        private List<Objects.EnumObject> m_Enums;
        public List<Objects.EnumObject> Enums
        {
            get { return m_Enums; }
            set { m_Enums = value; }
        }
                

        private List<Objects.ConnectionStringObject> m_ConnectionStrings;
        public List<Objects.ConnectionStringObject> ConnectionStrings
        {
            get { return m_ConnectionStrings; }
            set { m_ConnectionStrings = value; }
        }
                
                
        public ProjectOptions()
        {
            InitializeComponent();
            this.Loaded += ProjectOptions_Loaded;
            //use the data context to get data for this project
            
        }

        void ProjectOptions_Loaded(object sender, RoutedEventArgs e)
        {
            var project = (Objects.ProjectObject)this.DataContext;
            this.Items = Objects.Dbo.Procs.Object_Get.ToList<Objects.ObjectObject>(project);
            this.Enums = Objects.Dbo.Procs.Enum_Get.ToList<Objects.EnumObject>(project);
            this.ConnectionStrings = Objects.Dbo.Procs.ConnectionString_Get.ToList<Objects.ConnectionStringObject>(project);
            this.ObjectsList.ItemsSource = this.Items;
            this.EnumsList.ItemsSource = this.Enums;
            this.ConnectionsList.ItemsSource = this.ConnectionStrings;
        }
    }
}
