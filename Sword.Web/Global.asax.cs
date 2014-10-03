using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using R = System.Web.Routing;

namespace Sword.Web
{
    public class Global : System.Web.HttpApplication
    {

        public static void Register(R.RouteCollection routes)
        {

            routes.MapHttpRoute(
                name: "ControllerActionObj0",
                routeTemplate: "api/Project/{controller}/{action}/{obj}",
                defaults: new { obj = RouteParameter.Optional }
            );

            routes.MapHttpRoute(
                name: "ControllerObj1",
                routeTemplate: "api/Project/{controller}/{obj}",
                defaults: new { obj = RouteParameter.Optional }
            );

            routes.MapHttpRoute(
                name: "ControllerActionObj",
                routeTemplate: "api/{controller}/{action}/{obj}",
                defaults: new { obj = RouteParameter.Optional }
            );

            routes.MapHttpRoute(
                name: "ControllerObj",
                routeTemplate: "api/{controller}/{obj}",
                defaults: new { obj = RouteParameter.Optional }
            );




            routes.Ignore("Images/{pathInfo}.svg");
            routes.Ignore("Images/{pathInfo}.png");
            routes.Ignore("Images/{pathInfo}.jpg");
            routes.Ignore("Views/{pathInfo}");
            routes.Ignore("Views/{pathInfo}/{Param1}");
            routes.Ignore("Views/{pathInfo}/{Param1}/{Param2}");
            routes.Ignore("Views/{pathInfo}/{Param1}/{Param2}/{Param3}");

            routes.MapPageRoute("Main", "", "~/Default.aspx");
            routes.MapPageRoute("Page", "{Page}", "~/Default.aspx");
            routes.MapPageRoute("SubPages", "{Page}/{SubPage}", "~/Default.aspx");
            routes.MapPageRoute("TertPages", "{Page}/{SubPage}/{TertPage}", "~/Default.aspx");
            routes.MapPageRoute("QuatPages", "{Page}/{SubPage}/{TertPage}/{QuatPages}", "~/Default.aspx");
            routes.MapPageRoute("QuinPages", "{Page}/{SubPage}/{TertPage}/{QuatPages}/{QuinPages}", "~/Default.aspx");
            routes.MapPageRoute("SexPages", "{Page}/{SubPage}/{TertPage}/{QuatPages}/{QuinPages}/{SexPages}", "~/Default.aspx");

        }

        void stageViews()
        {
            var directory = Server.MapPath("~/Views");
            var files = System.IO.Directory.GetFiles(directory, "*.html", System.IO.SearchOption.AllDirectories);
            foreach (var file in files)
            {
                Universal.Views.Add(new ViewInfo(file));
            }
        }

        protected void Application_Start(object sender, EventArgs e)
        {
            System.Web.Http.GlobalConfiguration.Configuration.Formatters.XmlFormatter.SupportedMediaTypes.Clear();
            var routes = RouteTable.Routes;
            //stageViews();
            //registerBundles(BundleTable.Bundles);
            
            Register(routes);
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}