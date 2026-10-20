using Microsoft.Extensions.DependencyInjection;
using NexLog.Rating.Application.Services;
using NexLog.Rating.Infrastructure.Persistence;

namespace NexLog.Rating.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddRatingInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ICarrierQuoteRepository, CarrierQuoteRepository>();
        return services;
    }
}
