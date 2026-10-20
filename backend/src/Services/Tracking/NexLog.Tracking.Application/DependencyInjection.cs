using Microsoft.Extensions.DependencyInjection;
using NexLog.Tracking.Application.Services;

namespace NexLog.Tracking.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddTrackingApplication(this IServiceCollection services)
    {
        services.AddScoped<IShipmentService, ShipmentService>();
        return services;
    }
}
