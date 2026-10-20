using Microsoft.Extensions.DependencyInjection;
using NexLog.Documents.Application.Services;
using NexLog.Documents.Infrastructure.Persistence;

namespace NexLog.Documents.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddDocumentsInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IDocumentItemRepository, DocumentItemRepository>();
        services.AddScoped<IEpodRecordRepository, EpodRecordRepository>();
        return services;
    }
}
