using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtestion
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query.Select(order => new OrderDto
            {
                Id = order.Id,
                BuyerId = order.BuyerId,
                DeliveryFee = order.DeliveryFee,
                OrderDate = order.OrderDate,
                OrderStatus = order.OrderStatus.ToString(),
                ShippingAddress = order.ShippingAddress,
                Subtotal = order.Subtotal,
                Total = order.GetTotal(),
                OrderItem = order.OrderItem.Select(item => new OrderItemDto
                {
                    ProductId = item.ItemOrdered.ProductId,
                    Name = item.ItemOrdered.Name,
                    PictureUrl = item.ItemOrdered.PictureUrl,
                    Price = item.Price,
                    Quantity = item.Quantity
                }).ToList()

            }
            ).AsNoTracking();
        }
    }
}