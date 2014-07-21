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
    /// Interaction logic for ProjectsAndConnections.xaml
    /// </summary>
    public partial class ProjectsAndConnections : Page
    {
        public ProjectsAndConnections()
        {
            InitializeComponent();
            this.Title = "Projects and Connections";
            ProjectsList.ItemsSource = Data.Projects;
            ConnectionsList.ItemsSource = Data.Connections;
        }

        //public void ProjectEditClick(object sender, RoutedEventArgs e)
        //{
        //    var btn = (Button)sender;
        //    var dc = btn.DataContext;
        //    MessageBox.Show("Not built out");
        //    //this.To(new Page(), dc);
        //    //have what you need can pull up form view for edit
        //}
        //public void ProjectClassClick(object sender, RoutedEventArgs e)
        //{
        //    var btn = (Button)sender;
        //    var dc = btn.DataContext;
        //    MessageBox.Show("Not built out");
        //    //this.To(new Page(), dc);
        //    //have what you need can pull up form view for edit
        //}

        //public void ProjectOptionsClick(object sender, RoutedEventArgs e)
        //{
        //    var btn = (Button)sender;
        //    var dc = btn.DataContext;
        //    this.To(new ProjectOptions(), dc);
        //}

        //public void ConnectionEditClick(object sender, RoutedEventArgs e)
        //{
        //    var btn = (Button)sender;
        //    var dc = btn.DataContext;
        //    MessageBox.Show("Not built out");
        //    //have what you need can pull up form view for edit
        //    //this.To(new Page(), dc);
        //}

        private void ProjectMore_Click(object sender, RoutedEventArgs e)
        {
            var project = (Objects.ProjectObject)((Button)sender).DataContext;
            var dialog = new Windows.ProjectDialog(project);
            dialog.Owner = Navigator.MainWindow;  
            dialog.ShowDialog();
        }
    }
}
