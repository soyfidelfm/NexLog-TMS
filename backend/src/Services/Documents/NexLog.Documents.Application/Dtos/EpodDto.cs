using System.ComponentModel.DataAnnotations;
using NexLog.Documents.Domain;

namespace NexLog.Documents.Application.Dtos;

/// <summary>Mirrors the Angular model (camelCase JSON). Id is optional on POST (auto-generated).</summary>
public sealed record EpodDto(
    string? Id,
    string? LoadId,
    string Signature,
    string PhotoUrl,
    double GpsLat,
    double GpsLng,
    string Address,
    string DeliveredAt,
    string SignedBy,
    string? Notes);
