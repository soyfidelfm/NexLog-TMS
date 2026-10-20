using Microsoft.Extensions.DependencyInjection;
using NexLog.Dashboard.Application.Services;

namespace NexLog.Dashboard.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddDashboardApplication(this IServiceCollection services)
    {
        services.AddScoped<IKpiService, KpiService>();
        services.AddScoped<IDashboardAlertService, DashboardAlertService>();
        return services;
    }
}
