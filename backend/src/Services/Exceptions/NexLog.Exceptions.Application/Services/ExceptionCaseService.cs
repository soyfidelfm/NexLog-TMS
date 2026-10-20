using NexLog.BuildingBlocks.Application;
using NexLog.BuildingBlocks.Common;
using NexLog.Exceptions.Application.Dtos;
using NexLog.Exceptions.Domain.Entities;

namespace NexLog.Exceptions.Application.Services;

public interface IExceptionCaseRepository : IRepository<ExceptionCase>;

public interface IExceptionCaseService : ICrudService<ExceptionItemDto>;

public sealed class ExceptionCaseService(IExceptionCaseRepository repository) : CrudService<ExceptionCase, ExceptionItemDto>(repository), IExceptionCaseService
{
    protected override string EntityName => "ExceptionCase";
    protected override string IdPrefix => "EXC";
    protected override string? GetDtoId(ExceptionItemDto d) => d.Id;

    protected override ExceptionItemDto ToDto(ExceptionCase e) => new(e.Id, e.Type, e.Title, e.LoadId, e.OrderId, e.Carrier, e.Severity, e.Status, e.OpenedAt, e.LastUpdate, e.Location, e.Description, e.Timeline, e.Actions, e.Communications);

    protected override void Apply(ExceptionItemDto d, ExceptionCase e)
    {
        e.Type = d.Type;
        e.Title = d.Title;
        e.LoadId = d.LoadId;
        e.OrderId = d.OrderId;
        e.Carrier = d.Carrier;
        e.Severity = d.Severity;
        e.Status = d.Status;
        e.OpenedAt = d.OpenedAt;
        e.LastUpdate = d.LastUpdate;
        e.Location = d.Location;
        e.Description = d.Description;
        e.Timeline = d.Timeline;
        e.Actions = d.Actions;
        e.Communications = d.Communications;
    }

    protected override IQueryable<ExceptionCase> Filter(IQueryable<ExceptionCase> q, PageQuery p)
    {
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var s = p.Search.Trim().ToLower();
            q = q.Where(e => e.Id.ToLower().Contains(s) || e.Title.ToLower().Contains(s) || e.LoadId.ToLower().Contains(s) || e.Carrier.ToLower().Contains(s));
        }
        if (!string.IsNullOrWhiteSpace(p.Status)) q = q.Where(e => e.Status == p.Status);
        return q;
    }
}
