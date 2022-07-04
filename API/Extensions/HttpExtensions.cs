using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse @this, MetaData metaData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            @this.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
            @this.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}