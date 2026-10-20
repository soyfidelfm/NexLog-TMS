// API Gateway (YARP): single entry point http://localhost:5100/api/* -> each microservice.
// Validates the Auth0 JWT (same rules as the services) and forwards the Authorization header untouched.
using NexLog.BuildingBlocks.Web.Hosting;
using NexLog.BuildingBlocks.Web.Security;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddNexLogCors(builder.Configuration);
builder.Services.AddNexLogAuth0(builder.Configuration);
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    // CORS is answered by the gateway; drop Origin so services don't add duplicate CORS headers.
    .AddTransforms(t => t.AddRequestHeaderRemove("Origin"));
builder.Services.AddHealthChecks();

var app = builder.Build();
app.UseCors(ServiceHostExtensions.CorsPolicy);
app.UseNexLogAuth();
app.MapHealthChecks("/health").AllowAnonymous();
app.MapReverseProxy();   // covered by the fallback policy (authenticated user required)
app.Run();
