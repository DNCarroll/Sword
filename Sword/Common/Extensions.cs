using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sword
{
    public static class Extensions
    {    
        public static bool Matches(this string input, string pattern, System.Text.RegularExpressions.RegexOptions options = System.Text.RegularExpressions.RegexOptions.IgnoreCase)
        {
            return System.Text.RegularExpressions.Regex.IsMatch(input, pattern, options);
        }

        public static string GroupValue(this string input, string pattern, string groupName, System.Text.RegularExpressions.RegexOptions options = System.Text.RegularExpressions.RegexOptions.IgnoreCase)
        {
            string ret = null;
            var regex = new System.Text.RegularExpressions.Regex(pattern, options);
            if(regex.IsMatch(input))
            {
                var match = regex.Match(input);
                if(match.Groups[groupName]!=null)
                {
                    ret = match.Groups[groupName].ToString();
                }
            }
            return ret;
        }
    }
}
