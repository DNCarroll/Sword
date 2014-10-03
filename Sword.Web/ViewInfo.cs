using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Sword.Web
{
    //shouldnt be needed?
    public class ViewInfo
    {

        public ViewInfo(string path)
        {
            var temp = path.Substring(path.IndexOf("Views"));
            temp = temp.Replace("Views\\", "");
            this.Key = temp.Replace("\\", ".");
            this.Key = this.Key.Replace(".html", "");
            //read the HTML for this one
            //path = HttpContext.Current.Server.MapPath(this.Path());
            if (System.IO.File.Exists(path))
            {
                this.HTML = System.IO.File.ReadAllText(path);
            }
        }

        //public string Path()
        //{
        //    return "~/Views/" + this.Key.Replace(".", "/") + ".html";
        //}

        private string m_Key;
        public string Key
        {
            get { return m_Key; }
            set { m_Key = value; }
        }

        private string m_HTML;
        public string HTML
        {
            get { return m_HTML; }
            set { m_HTML = value; }
        }

    }
}