using NexLog.BuildingBlocks.Common;
using NexLog.BuildingBlocks.Domain;

namespace NexLog.BuildingBlocks.Application;

public interface ICrudService<TDto>
{
    Task<PagedResult<TDto>> GetPagedAsync(PageQuery query, CancellationToken ct = default);
    Task<List<TDto>> GetAllAsync(CancellationToken ct = default);
    Task<Result<TDto>> GetByIdAsync(string id, CancellationToken ct = default);
    Task<Result<TDto>> CreateAsync(TDto dto, CancellationToken ct = default);
    Task<Result<TDto>> UpdateAsync(string id, TDto dto, CancellationToken ct = default);
    Task<Result> DeleteAsync(string id, CancellationToken ct = default);
}

/// <summary>Generic application service: maps DTO &lt;-&gt; entity and applies paging/filtering.</summary>
public abstract class CrudService<TEntity, TDto>(IRepository<TEntity> repository) : ICrudService<TDto>
    where TEntity : Entity, new()
{
    protected IRepository<TEntity> Repository { get; } = repository;
    protected abstract string EntityName { get; }
    protected abstract string IdPrefix { get; }
    protected abstract TDto ToDto(TEntity entity);
    protected abstract void Apply(TDto dto, TEntity entity);
    protected abstract string? GetDtoId(TDto dto);
    protected virtual IQueryable<TEntity> Filter(IQueryable<TEntity> q, PageQuery query) => q;

    public async Task<PagedResult<TDto>> GetPagedAsync(PageQuery query, CancellationToken ct = default)
    {
        var page = await Repository.GetPagedAsync(q =>
        {
            var f = Filter(q, query);
            return query.Descending ? f.OrderByDescending(e => e.Id) : f.OrderBy(e => e.Id);
        }, query.Page, query.PageSize, ct);
        return new PagedResult<TDto>(page.Items.Select(ToDto).ToList(), page.Page, page.PageSize, page.TotalCount);
    }

    public async Task<List<TDto>> GetAllAsync(CancellationToken ct = default) =>
        (await Repository.ListAsync(q => q.OrderBy(e => e.Id), ct)).Select(ToDto).ToList();

    public async Task<Result<TDto>> GetByIdAsync(string id, CancellationToken ct = default)
    {
        var e = await Repository.GetByIdAsync(id, ct);
        return e is null ? Result<TDto>.Failure(Error.NotFound(EntityName, id)) : Result<TDto>.Success(ToDto(e));
    }

    public async Task<Result<TDto>> CreateAsync(TDto dto, CancellationToken ct = default)
    {
        var id = GetDtoId(dto);
        if (string.IsNullOrWhiteSpace(id)) id = $"{IdPrefix}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
        if (await Repository.ExistsAsync(id, ct)) return Result<TDto>.Failure(Error.Conflict(EntityName, id));
        var e = new TEntity { Id = id, CreatedAt = DateTime.UtcNow };
        Apply(dto, e);
        await Repository.AddAsync(e, ct);
        return Result<TDto>.Success(ToDto(e));
    }

    public async Task<Result<TDto>> UpdateAsync(string id, TDto dto, CancellationToken ct = default)
    {
        var e = await Repository.GetByIdAsync(id, ct);
        if (e is null) return Result<TDto>.Failure(Error.NotFound(EntityName, id));
        Apply(dto, e);
        e.UpdatedAt = DateTime.UtcNow;
        await Repository.UpdateAsync(e, ct);
        return Result<TDto>.Success(ToDto(e));
    }

    public async Task<Result> DeleteAsync(string id, CancellationToken ct = default)
    {
        var e = await Repository.GetByIdAsync(id, ct);
        if (e is null) return Result.Failure(Error.NotFound(EntityName, id));
        await Repository.DeleteAsync(e, ct);
        return Result.Success();
    }
}
