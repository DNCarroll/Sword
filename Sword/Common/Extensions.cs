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
    }
}
