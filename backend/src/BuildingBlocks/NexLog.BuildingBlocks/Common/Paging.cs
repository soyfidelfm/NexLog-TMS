namespace NexLog.BuildingBlocks.Common;

/// <summary>Query string for list endpoints: ?page=1&amp;pageSize=20&amp;search=texto&amp;status=Active</summary>
public sealed class PageQuery
{
    private int _page = 1, _size = 20;
    public int Page { get => _page; set => _page = value < 1 ? 1 : value; }
    public int PageSize { get => _size; set => _size = value is < 1 ? 20 : Math.Min(value, 200); }
    public string? Search { get; set; }
    public string? Status { get; set; }
    public bool Descending { get; set; }
}

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Page, int PageSize, int TotalCount)
{
    public int TotalPages => PageSize == 0 ? 0 : (int)Math.Ceiling(TotalCount / (double)PageSize);
}
