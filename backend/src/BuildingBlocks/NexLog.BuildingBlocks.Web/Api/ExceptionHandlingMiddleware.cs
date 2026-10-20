using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NexLog.BuildingBlocks.Common;

namespace NexLog.BuildingBlocks.Web.Api;

/// <summary>Converts unhandled exceptions into RFC 7807 ProblemDetails responses.</summary>
public sealed class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext ctx)
    {
        try { await next(ctx); }
        catch (Exception ex)
        {
            var (status, title) = ex switch
            {
                NotFoundException => (404, "Not Found"),
                ConflictException => (409, "Conflict"),
                DomainValidationException => (400, "Validation error"),
                _ => (500, "Server error"),
            };
            if (status == 500) logger.LogError(ex, "Unhandled exception");
            ctx.Response.StatusCode = status;
            await ctx.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Status = status, Title = title,
                Detail = status == 500 ? "An unexpected error occurred." : ex.Message,
                Instance = ctx.Request.Path,
            });
        }
    }
}
