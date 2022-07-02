using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Item { get; set; }= new();
        public void AddItem(Product product,int quantity)
        {
            if(Item.All(item=>item.ProductId!=product.Id))
            {
                Item.Add(new BasketItem{
                    Product=product,
                    Quantity=quantity
                    });
            }
            var existingItem = Item.FirstOrDefault(item=>item.ProductId==product.Id);
            if(existingItem!=null) existingItem.Quantity +=quantity;
        }
        public void RemoveItem(int productId,int quantity)
        {
            var item=Item.FirstOrDefault(item=>item.ProductId==productId);
            if(item==null)return;
            item.Quantity-=quantity;
            if(item.Quantity==0) Item.Remove(item);
        }
    }
}