using Microsoft.Extensions.DependencyInjection;
using NexLog.Loads.Application.Services;
using NexLog.Loads.Infrastructure.Persistence;

namespace NexLog.Loads.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddLoadsInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ILoadRepository, LoadRepository>();
        services.AddScoped<ITrailerRepository, TrailerRepository>();
        services.AddScoped<IPlanningOrderRepository, PlanningOrderRepository>();
        return services;
    }
}
