using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace Sword.WebObjectConstructor
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            var routes = RouteTable.Routes;
            //routes.MapPageRoute("Main", "", "~/Default.aspx");
            //routes.MapPageRoute("Page", "{Page}", "~/Default.aspx");
            //routes.MapPageRoute("SubPages", "{Page}/{SubPage}", "~/Default.aspx");
            //routes.MapPageRoute("TertPages", "{Page}/{SubPage}/{TertPage}", "~/Default.aspx");
            //routes.MapPageRoute("QuatPages", "{Page}/{SubPage}/{TertPage}/{QuatPages}", "~/Default.aspx");
            //routes.MapPageRoute("QuinPages", "{Page}/{SubPage}/{TertPage}/{QuatPages}/{QuinPages}", "~/Default.aspx");
            //routes.MapPageRoute("SexPages", "{Page}/{SubPage}/{TertPage}/{QuatPages}/{QuinPages}/{SexPages}", "~/Default.aspx");
        }
    }
}