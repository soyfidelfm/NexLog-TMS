// API Gateway (YARP): single entry point http://localhost:5100/api/* -> each microservice.
var builder = WebApplication.CreateBuilder(args);
var origins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:4200"];
builder.Services.AddCors(o => o.AddPolicy("frontend", p => p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
builder.Services.AddHealthChecks();

var app = builder.Build();
app.UseCors("frontend");
app.MapHealthChecks("/health");
app.MapReverseProxy();
app.Run();
