using Microsoft.Extensions.DependencyInjection;
using NexLog.Orders.Application.Services;

namespace NexLog.Orders.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddOrdersApplication(this IServiceCollection services)
    {
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IOrderDetailService, OrderDetailService>();
        return services;
    }
}
