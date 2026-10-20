using Microsoft.Extensions.DependencyInjection;
using NexLog.Carriers.Application.Services;

namespace NexLog.Carriers.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddCarriersApplication(this IServiceCollection services)
    {
        services.AddScoped<ICarrierService, CarrierService>();
        return services;
    }
}
