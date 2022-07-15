using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {
        private readonly ILogger<OrderController> _logger;
        private readonly StoreContext _context;

        public OrderController(ILogger<OrderController> logger, StoreContext context)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                    .ProjectOrderToOrderDto()
                    .Where(x => x.BuyerId == User.Identity.Name)
                    .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                    .ProjectOrderToOrderDto()
                    .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                    .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context.Baskets
                            .RetriveBasketWithItems(User.Identity.Name)
                            .FirstOrDefaultAsync();
            if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not location basket" });


            var items = new List<OrderItem>();

            foreach (var item in basket.Item)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            var order = new Order
            {
                OrderItem = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                Subtotal = subtotal,
                DeliveryFee = deliveryFee
            };
            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);

            if (orderDto.SaveAddress)
            {
                var user = await _context.Users
                    .Include(a => a.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                var address = new UserAddress
                {
                    FullName = order.ShippingAddress.FullName,
                    Address1 = order.ShippingAddress.Address1,
                    Address2 = order.ShippingAddress.Address2,
                    City = order.ShippingAddress.City,
                    Country = order.ShippingAddress.Country,
                    Zip = order.ShippingAddress.Zip,
                    State = order.ShippingAddress.State
                };
                user.Address = address;
            }
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return CreatedAtAction("GetOrder", new { id = order.Id }, order.Id);
            return BadRequest("Problem Create order");
        }
    }
}