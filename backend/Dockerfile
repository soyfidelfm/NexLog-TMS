# Generic multi-stage image for any NexLog service.
# docker build --build-arg PROJECT=src/Services/Orders/NexLog.Orders.Api/NexLog.Orders.Api.csproj -t nexlog-orders .
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG PROJECT
WORKDIR /src
COPY . .
RUN dotnet publish "$PROJECT" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ARG ASSEMBLY
ENV ASSEMBLY=${ASSEMBLY}
ENTRYPOINT ["sh", "-c", "dotnet ${ASSEMBLY}.dll"]
