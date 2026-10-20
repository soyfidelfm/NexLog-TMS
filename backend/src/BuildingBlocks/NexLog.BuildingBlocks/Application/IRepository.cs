using NexLog.BuildingBlocks.Common;
using NexLog.BuildingBlocks.Domain;

namespace NexLog.BuildingBlocks.Application;

public interface IRepository<T> where T : Entity
{
    Task<PagedResult<T>> GetPagedAsync(Func<IQueryable<T>, IQueryable<T>> query, int page, int pageSize, CancellationToken ct = default);
    Task<List<T>> ListAsync(Func<IQueryable<T>, IQueryable<T>>? query = null, CancellationToken ct = default);
    Task<T?> GetByIdAsync(string id, CancellationToken ct = default);
    Task<bool> ExistsAsync(string id, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(T entity, CancellationToken ct = default);
}
