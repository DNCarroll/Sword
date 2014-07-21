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
using System.Windows.Shapes;

namespace Sword.ObjectConstructor.Windows
{
    /// <summary>
    /// Interaction logic for ProjectDialog.xaml
    /// </summary>
    public partial class ProjectDialog : Window
    {
        public ProjectDialog(Objects.ProjectObject project)
        {
            InitializeComponent();
            this.DataContext = project;
            this.Loaded += ProjectDialog_Loaded;
        }

        void ProjectDialog_Loaded(object sender, RoutedEventArgs e)
        {
            var project = this.DataContext as Objects.ProjectObject;
            this.Title = project.Name + " Actions";
        }

        private void editProject_Click(object sender, RoutedEventArgs e)
        {
            //open the project edit view
            this.DialogResult = true;
        }
        private void objects_Click(object sender, RoutedEventArgs e)
        {
            //open the list of object view
            Navigator.To(new Pages.ObjectsList(), (Objects.ProjectObject)this.DataContext);
            this.DialogResult = true;
        }
        private void enums_Click(object sender, RoutedEventArgs e)
        {
            //open the enums view
            Navigator.To(new Pages.EnumLists(), (Objects.ProjectObject)this.DataContext);
            this.DialogResult = true;
        }
        private void connectionStrings_Click(object sender, RoutedEventArgs e)
        {
            //open the connection strings view
            
            this.DialogResult = true;
        }
        private void cSharp_Click(object sender, RoutedEventArgs e)
        {
            //open the full csharp code
            this.DialogResult = true;
        }
        private void cSharpPortable_Click(object sender, RoutedEventArgs e)
        {
            //portable c#
            this.DialogResult = true;
        }
        private void typeScript_Click(object sender, RoutedEventArgs e)
        {
            //typescript
            this.DialogResult = true;
        }
    }
}
