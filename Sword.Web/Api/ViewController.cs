using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Sword;

namespace Sword.Web.Api
{
    public class ViewController : ApiController
    {
        [HttpPatch]
        public string Select([FromBody]DynamicSword obj)
        {
            if (obj["Type"] != null)
            {
                try
                {
                    var type = (string)obj["Type"];
                    var path = "~/Views/" + type + ".html";
                    path = System.Web.HttpContext.Current.Server.MapPath(path);
                    var raw = System.IO.File.ReadAllText(path);
                    return raw;
                }
                catch (Exception ex)
                {                    
                }
            }
            return null;
        }
    }
}