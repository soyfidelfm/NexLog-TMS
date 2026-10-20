using Microsoft.Extensions.DependencyInjection;
using NexLog.RateTables.Application.Services;

namespace NexLog.RateTables.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddRateTablesApplication(this IServiceCollection services)
    {
        services.AddScoped<IRateTableService, RateTableService>();
        services.AddScoped<IRolePermissionService, RolePermissionService>();
        return services;
    }
}
