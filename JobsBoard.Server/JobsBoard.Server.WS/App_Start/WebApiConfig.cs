using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace SINAES2.Server.WS
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // EnableCors
            config.EnableCors();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/ws/{controller}/{Action}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
