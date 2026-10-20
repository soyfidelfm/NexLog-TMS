using Microsoft.Extensions.DependencyInjection;
using NexLog.Tracking.Application.Services;
using NexLog.Tracking.Infrastructure.Persistence;

namespace NexLog.Tracking.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddTrackingInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IShipmentRepository, ShipmentRepository>();
        return services;
    }
}
