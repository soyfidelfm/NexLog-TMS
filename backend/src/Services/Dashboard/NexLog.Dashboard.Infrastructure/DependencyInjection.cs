using Microsoft.Extensions.DependencyInjection;
using NexLog.Dashboard.Application.Services;
using NexLog.Dashboard.Infrastructure.Persistence;

namespace NexLog.Dashboard.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddDashboardInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IKpiRepository, KpiRepository>();
        services.AddScoped<IDashboardAlertRepository, DashboardAlertRepository>();
        return services;
    }
}
