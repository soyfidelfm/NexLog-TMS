using Microsoft.Extensions.DependencyInjection;
using NexLog.Documents.Application.Services;

namespace NexLog.Documents.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddDocumentsApplication(this IServiceCollection services)
    {
        services.AddScoped<IDocumentItemService, DocumentItemService>();
        services.AddScoped<IEpodRecordService, EpodRecordService>();
        return services;
    }
}
