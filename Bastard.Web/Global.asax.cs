using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Optimization;


//10:39 AMo the area thttp://stackoverflow.com/questions/11944745/asp-net-bundles-how-to-disable-minification


namespace Bastard
{
    public class Global : System.Web.HttpApplication
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            BundleTable.EnableOptimizations = true;            
            bundles.Add(new Bundle("~/bastard-bundled.js").Include(
                "~/Scripts/json.js",
                "~/Prototypes/Array.js",
                "~/Prototypes/Date.js",
                "~/Prototypes/Element.js",
                "~/Prototypes/HTMLElement.js",
                "~/Prototypes/Select.js",
                "~/Prototypes/String.js",
                "~/Prototypes/Window.js",                
                "~/Modules/Thing.js",
                "~/Modules/Is.js",
                "~/Modules/Ajax.js",                
                "~/Modules/Formatters.js",                
                "~/Modules/RegularExpression.js",
                "~/Modules/Local.js",
                "~/Modules/Session.js",                
                "~/Modules/Calendar.js",
                "~/Modules/Convert.js",
                "~/Modules/Cookie.js",
                "~/Modules/Formatters.js",
                "~/Modules/KeyPress.js",
                "~/Modules/Dialog.js",
                "~/Modules/Bind.js"));

            bundles.Add(new ScriptBundle("~/bastard-minified.js").Include(
                "~/Scripts/json.js",
                "~/Prototypes/Array.js",
                "~/Prototypes/Date.js",
                "~/Prototypes/Element.js",
                "~/Prototypes/HTMLElement.js",
                "~/Prototypes/Select.js",
                "~/Prototypes/String.js",
                "~/Prototypes/Window.js",
                "~/Modules/Thing.js",
                "~/Modules/Is.js",
                "~/Modules/Ajax.js",
                "~/Modules/Formatters.js",
                "~/Modules/RegularExpression.js",
                "~/Modules/Local.js",
                "~/Modules/Session.js",                
                "~/Modules/Calendar.js",
                "~/Modules/Convert.js",
                "~/Modules/Cookie.js",
                "~/Modules/Formatters.js",
                "~/Modules/KeyPress.js",
                "~/Modules/Dialog.js",
                "~/Modules/Bind.js"));

        }
        protected void Application_Start(object sender, EventArgs e)
        {

            RegisterBundles(BundleTable.Bundles);
            var routes = RouteTable.Routes;
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

            routes.MapPageRoute("CustomerTest", "Customer/{CustomerID}", "~/Customer.aspx");
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