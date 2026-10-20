using Microsoft.Extensions.DependencyInjection;
using NexLog.Tendering.Application.Services;

namespace NexLog.Tendering.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddTenderingApplication(this IServiceCollection services)
    {
        services.AddScoped<ITenderService, TenderService>();
        return services;
    }
}
