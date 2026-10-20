using Microsoft.Extensions.DependencyInjection;
using NexLog.Rating.Application.Services;

namespace NexLog.Rating.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddRatingApplication(this IServiceCollection services)
    {
        services.AddScoped<ICarrierQuoteService, CarrierQuoteService>();
        return services;
    }
}
