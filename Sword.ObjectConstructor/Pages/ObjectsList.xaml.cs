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
    /// Interaction logic for ObjectsList.xaml
    /// </summary>
    public partial class ObjectsList : Page
    {

        public ObjectsList()
        {
            InitializeComponent();
            
            this.Loaded += ObjectsList_Loaded;
        }

        void ObjectsList_Loaded(object sender, RoutedEventArgs e)
        {
            var project = (Objects.ProjectObject)this.DataContext;
            this.Title = project.Name + " Objects";
            this.Items.ItemsSource = Objects.Dbo.Procs.Object_Get.ToList<Objects.ObjectObject>(project);
        }
    }
}
