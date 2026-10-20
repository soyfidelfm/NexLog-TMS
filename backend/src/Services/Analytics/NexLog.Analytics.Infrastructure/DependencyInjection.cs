using Microsoft.Extensions.DependencyInjection;
using NexLog.Analytics.Application.Services;
using NexLog.Analytics.Infrastructure.Persistence;

namespace NexLog.Analytics.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddAnalyticsInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ILaneCostRepository, LaneCostRepository>();
        services.AddScoped<ICarrierPerformanceRepository, CarrierPerformanceRepository>();
        services.AddScoped<IOnTimeTrendRepository, OnTimeTrendRepository>();
        services.AddScoped<IModeVolumeRepository, ModeVolumeRepository>();
        return services;
    }
}
