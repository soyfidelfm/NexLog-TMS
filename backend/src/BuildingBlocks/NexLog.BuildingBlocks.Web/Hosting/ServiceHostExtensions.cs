using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NexLog.BuildingBlocks.Web.Api;

namespace NexLog.BuildingBlocks.Web.Hosting;

public static class ServiceHostExtensions
{
    public const string CorsPolicy = "frontend";

    /// <summary>Controllers, Swagger, CORS (Angular http://localhost:4200), health checks and the Npgsql DbContext.</summary>
    public static WebApplicationBuilder AddNexLogService<TContext>(this WebApplicationBuilder builder, string schema)
        where TContext : DbContext
    {
        var cs = builder.Configuration.GetConnectionString("Default")
                 ?? throw new InvalidOperationException("ConnectionStrings:Default is missing");
        builder.Services.AddDbContext<TContext>(o => o.UseNpgsql(cs, npg =>
            npg.MigrationsHistoryTable("__EFMigrationsHistory", schema)));
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddProblemDetails();
        var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:4200"];
        builder.Services.AddCors(o => o.AddPolicy(CorsPolicy, p => p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));
        builder.Services.AddHealthChecks().AddDbContextCheck<TContext>("database");
        return builder;
    }

    /// <summary>Pipeline + optional auto-migrate and seed (Database:MigrateOnStartup).</summary>
    public static async Task RunNexLogServiceAsync<TContext>(this WebApplication app, Func<TContext, Task> seed)
        where TContext : DbContext
    {
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseCors(CorsPolicy);
        app.MapControllers();
        app.MapHealthChecks("/health");

        if (app.Configuration.GetValue("Database:MigrateOnStartup", true))
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<TContext>();
            await db.Database.MigrateAsync();
            if (app.Configuration.GetValue("Database:Seed", true)) await seed(db);
        }
        await app.RunAsync();
    }
}
