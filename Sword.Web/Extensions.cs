using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sword.Web
{
    public static class Extensions
    {
        public static System.Text.StringBuilder AppendWithTabs(this System.Text.StringBuilder sb, string toAppend, int tabCount, bool includeLineReturn = false)
        {
            var t = "";
            if (tabCount > 0)
            {
                t = Tabs(tabCount);
            }
            sb.AppendLine(t + toAppend);
            if (includeLineReturn)
            {
                sb.AppendLine();
            }
            return sb;
        }

        public static string Tabs(int count)
        {
            string tab = "";
            int i = 0;
            while (i < count)
            {
                tab += "\t";
                i++;
            }
            return tab;
        }
    }
}