using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace NexLog.BuildingBlocks.Web.Persistence;

public static class JsonColumnExtensions
{
    private static readonly JsonSerializerOptions Opts = new(JsonSerializerDefaults.Web);

    /// <summary>Stores a value object / collection as a PostgreSQL jsonb column.</summary>
    public static PropertyBuilder<TProp> HasJsonb<TProp>(this PropertyBuilder<TProp> builder)
    {
        builder.HasConversion(
            v => JsonSerializer.Serialize(v, Opts),
            v => JsonSerializer.Deserialize<TProp>(v, Opts)!,
            new ValueComparer<TProp>(
                (a, b) => JsonSerializer.Serialize(a, Opts) == JsonSerializer.Serialize(b, Opts),
                v => JsonSerializer.Serialize(v, Opts).GetHashCode(),
                v => JsonSerializer.Deserialize<TProp>(JsonSerializer.Serialize(v, Opts), Opts)!));
        builder.HasColumnType("jsonb");
        return builder;
    }
}
