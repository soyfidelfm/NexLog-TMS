using Microsoft.Extensions.DependencyInjection;
using NexLog.Analytics.Application.Services;

namespace NexLog.Analytics.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddAnalyticsApplication(this IServiceCollection services)
    {
        services.AddScoped<ILaneCostService, LaneCostService>();
        services.AddScoped<ICarrierPerformanceService, CarrierPerformanceService>();
        services.AddScoped<IOnTimeTrendService, OnTimeTrendService>();
        services.AddScoped<IModeVolumeService, ModeVolumeService>();
        return services;
    }
}
