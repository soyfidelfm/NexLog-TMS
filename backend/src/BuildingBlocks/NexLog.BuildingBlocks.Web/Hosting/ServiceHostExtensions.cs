using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi;
using NexLog.BuildingBlocks.Web.Api;
using NexLog.BuildingBlocks.Web.Security;

namespace NexLog.BuildingBlocks.Web.Hosting;

public static class ServiceHostExtensions
{
    public const string CorsPolicy = "frontend";

    /// <summary>Controllers, Swagger (Bearer), CORS (Angular http://localhost:4200), Auth0 JWT, health checks and the Npgsql DbContext.</summary>
    public static WebApplicationBuilder AddNexLogService<TContext>(this WebApplicationBuilder builder, string schema)
        where TContext : DbContext
    {
        var cs = builder.Configuration.GetConnectionString("Default")
                 ?? throw new InvalidOperationException("ConnectionStrings:Default is missing");
        builder.Services.AddDbContext<TContext>(o => o.UseNpgsql(cs, npg =>
            npg.MigrationsHistoryTable("__EFMigrationsHistory", schema)));
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Auth0 access token (audience = Auth0:Audience). Paste only the token.",
            });
            c.AddSecurityRequirement(doc => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference("Bearer", doc)] = [],
            });
        });
        builder.Services.AddProblemDetails();
        builder.Services.AddNexLogCors(builder.Configuration);
        builder.Services.AddNexLogAuth0(builder.Configuration);
        builder.Services.AddHealthChecks().AddDbContextCheck<TContext>("database");
        return builder;
    }

    public static IServiceCollection AddNexLogCors(this IServiceCollection services, IConfiguration config)
    {
        var origins = config.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:4200"];
        return services.AddCors(o => o.AddPolicy(CorsPolicy, p => p.WithOrigins(origins)
            .WithHeaders("Authorization", "Content-Type", "Accept", "Accept-Language")
            .AllowAnyMethod()));
    }

    /// <summary>Pipeline + optional auto-migrate and seed (Database:MigrateOnStartup).</summary>
    public static async Task RunNexLogServiceAsync<TContext>(this WebApplication app, Func<TContext, Task> seed)
        where TContext : DbContext
    {
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseSwagger();      // swagger JSON/UI are plain middleware: always anonymous
        app.UseSwaggerUI();
        app.UseCors(CorsPolicy);
        app.UseNexLogAuth();
        app.MapControllers();
        app.MapHealthChecks("/health").AllowAnonymous();

        if (app.Configuration.GetValue("Database:MigrateOnStartup", true))
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<TContext>();
            await db.Database.MigrateAsync();
            if (app.Configuration.GetValue("Database:Seed", true)) await seed(db);
        }
        await app.RunAsync();
    }

    public static WebApplication UseNexLogAuth(this WebApplication app)
    {
        var opts = app.Services.GetRequiredService<Auth0Options>();
        if (opts.Enabled) app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<AuthenticationExtensions.PermissionMiddleware>();
        return app;
    }
}
