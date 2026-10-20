using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace NexLog.BuildingBlocks.Web.Security;

public static class AuthenticationExtensions
{
    public const string ReadPolicy = "tms:read";
    public const string WritePolicy = "tms:write";

    /// <summary>
    /// Auth0 JWT bearer validation (issuer, audience, lifetime, RS256 signature via OIDC metadata/JWKS)
    /// and a fallback policy that requires an authenticated user on every endpoint.
    /// </summary>
    public static IServiceCollection AddNexLogAuth0(this IServiceCollection services, IConfiguration config)
    {
        var opts = config.GetSection(Auth0Options.Section).Get<Auth0Options>() ?? new Auth0Options();
        services.AddSingleton(opts);

        if (!opts.Enabled)
        {
            services.AddAuthorization();
            return services;
        }

        if (string.IsNullOrWhiteSpace(opts.Audience) || (string.IsNullOrWhiteSpace(opts.Domain) && string.IsNullOrWhiteSpace(opts.Authority)))
            throw new InvalidOperationException("Auth0:Domain and Auth0:Audience must be configured (env vars Auth0__Domain / Auth0__Audience), or set Auth0:Enabled=false for local dev.");

        var authority = opts.ResolveAuthority();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(o =>
            {
                o.Authority = authority;
                o.Audience = opts.Audience;
                o.RequireHttpsMetadata = opts.RequireHttpsMetadata;
                o.MapInboundClaims = false;
                o.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authority,
                    ValidateAudience = true,
                    ValidAudience = opts.Audience,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidAlgorithms = [SecurityAlgorithms.RsaSha256],
                    ClockSkew = TimeSpan.FromMinutes(1),
                    NameClaimType = "sub",
                };
            });

        services.AddAuthorization(a =>
        {
            a.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
            a.AddPolicy(ReadPolicy, p => p.RequireAuthenticatedUser().RequireAssertion(c => HasPermission(c.User, opts.ReadPermission)));
            a.AddPolicy(WritePolicy, p => p.RequireAuthenticatedUser().RequireAssertion(c => HasPermission(c.User, opts.WritePermission)));
        });
        return services;
    }

    /// <summary>Auth0 puts RBAC permissions in "permissions" (one claim per value) and OAuth scopes in "scope" (space separated).</summary>
    public static bool HasPermission(ClaimsPrincipal user, string permission) =>
        user.FindAll("permissions").Any(c => c.Value == permission) ||
        user.FindAll("scope").Any(c => c.Value.Split(' ', StringSplitOptions.RemoveEmptyEntries).Contains(permission));

    /// <summary>Optional read:/write: enforcement (Auth0:EnforcePermissions=true). Runs after authorization.</summary>
    public sealed class PermissionMiddleware(RequestDelegate next, Auth0Options opts)
    {
        public async Task InvokeAsync(HttpContext ctx)
        {
            if (opts.Enabled && opts.EnforcePermissions && ctx.User.Identity?.IsAuthenticated == true
                && ctx.Request.Path.StartsWithSegments("/api"))
            {
                var needed = HttpMethods.IsGet(ctx.Request.Method) || HttpMethods.IsHead(ctx.Request.Method)
                    ? opts.ReadPermission : opts.WritePermission;
                if (!HasPermission(ctx.User, needed))
                {
                    ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await ctx.Response.WriteAsJsonAsync(new { status = 403, title = "Forbidden", detail = $"Missing permission '{needed}'." });
                    return;
                }
            }
            await next(ctx);
        }
    }
}
