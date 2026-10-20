using Microsoft.Extensions.DependencyInjection;
using NexLog.Loads.Application.Services;

namespace NexLog.Loads.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddLoadsApplication(this IServiceCollection services)
    {
        services.AddScoped<ILoadService, LoadService>();
        services.AddScoped<ITrailerService, TrailerService>();
        services.AddScoped<IPlanningOrderService, PlanningOrderService>();
        return services;
    }
}
