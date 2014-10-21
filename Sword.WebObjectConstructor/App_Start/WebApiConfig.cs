using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Sword.WebObjectConstructor
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            config.Routes.MapHttpRoute(
                name: "ControllerActionObj",
                routeTemplate: "api/{controller}/{action}/{obj}",
                defaults: new { obj = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "ControllerObj",
                routeTemplate: "api/{controller}/{obj}",
                defaults: new { obj = RouteParameter.Optional }
            );



        }
    }
}
