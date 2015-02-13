using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Sword
{
    public static class WebApi
    {   


        //add functionality for adding a header here
        public static async Task<T> Add<T>(this string url, T obj, Action<HttpClient> forClientSetup = null)
            where T : class
        {
            HttpClient _client = new HttpClient();
            if(forClientSetup!=null)
            {
                forClientSetup(_client);
            }
            T ret = null;
            var jsonString = JsonConvert.SerializeObject(obj);
            var content = new StringContent(jsonString, Encoding.UTF8, "application/json");

            var result = await _client.PostAsync(url, content);
            var json = await result.Content.ReadAsStringAsync();
            try
            {
                ret = JsonConvert.DeserializeObject<T>(json);
            }
            catch
            {
                throw;
            }
            return ret;
        }
    }
}
