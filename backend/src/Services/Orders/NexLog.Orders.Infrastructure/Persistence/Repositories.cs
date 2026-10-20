using NexLog.BuildingBlocks.Web.Persistence;
using NexLog.Orders.Application.Services;
using NexLog.Orders.Domain.Entities;

namespace NexLog.Orders.Infrastructure.Persistence;

public sealed class OrderRepository(OrdersDbContext db) : EfRepository<Order, OrdersDbContext>(db), IOrderRepository;

public sealed class OrderDetailRepository(OrdersDbContext db) : EfRepository<OrderDetail, OrdersDbContext>(db), IOrderDetailRepository;
