using Microsoft.Extensions.DependencyInjection;
using NexLog.Orders.Application.Services;
using NexLog.Orders.Infrastructure.Persistence;

namespace NexLog.Orders.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddOrdersInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
        return services;
    }
}
