using Microsoft.Extensions.DependencyInjection;
using NexLog.RouteOptimization.Application.Services;
using NexLog.RouteOptimization.Infrastructure.Persistence;

namespace NexLog.RouteOptimization.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddRouteOptimizationInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IOptRouteRepository, OptRouteRepository>();
        services.AddScoped<IRouteRunRepository, RouteRunRepository>();
        return services;
    }
}
