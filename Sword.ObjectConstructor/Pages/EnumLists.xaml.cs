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
    /// Interaction logic for EnumLists.xaml
    /// </summary>
    public partial class EnumLists : Page
    {
        public EnumLists()
        {
            InitializeComponent();            
            this.Loaded += EnumLists_Loaded;
        }

        void EnumLists_Loaded(object sender, RoutedEventArgs e)
        {
            var project = (Objects.ProjectObject)this.DataContext;
            this.Title = project.Name + " Enums";
            this.Items.ItemsSource = Objects.Dbo.Procs.Enum_Get.ToList<Objects.EnumObject>(project);
        }
    }
}
