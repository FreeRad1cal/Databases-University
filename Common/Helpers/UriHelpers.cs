using System;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace Helpers
{
    public static class UriHelpers
    {
        public static Uri BuildUri(string root, NameValueCollection query)
        {
            var collection = HttpUtility.ParseQueryString(string.Empty);

            foreach (var key in query.Cast<string>().Where(key => !string.IsNullOrEmpty(query[key])))
            {
                collection[key] = query[key];
            }

            UriBuilder builder = new UriBuilder(root) { Query = collection.ToString() };
            return builder.Uri;
        }
    }
}
