using API.Entities;

namespace API.Extensions
{
    public static class ProductExtesion
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> @this, string orderBy)
        {
            if (string.IsNullOrWhiteSpace(orderBy)) return @this.OrderBy(p => p.Name);

            @this = orderBy switch
            {
                "price" => @this.OrderBy(p => p.Price),
                "priceDesc" => @this.OrderByDescending(p => p.Price),
                _ => @this.OrderBy(p => p.Name)
            };
            return @this;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> @this, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return @this;
            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();
            return @this.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> @this, string brands, string types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();
            if (!string.IsNullOrEmpty(brands))
                brandList.AddRange(brands.ToLower().Split(",").ToList());

            if (!string.IsNullOrEmpty(types))
                typeList.AddRange(types.ToLower().Split(",").ToList());

            @this = @this.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            @this = @this.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

            return @this;
        }
    }
}