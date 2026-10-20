using Microsoft.Extensions.DependencyInjection;
using NexLog.RouteOptimization.Application.Services;

namespace NexLog.RouteOptimization.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddRouteOptimizationApplication(this IServiceCollection services)
    {
        services.AddScoped<IOptRouteService, OptRouteService>();
        services.AddScoped<IRouteRunService, RouteRunService>();
        return services;
    }
}
