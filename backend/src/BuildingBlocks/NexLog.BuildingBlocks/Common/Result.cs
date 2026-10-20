namespace NexLog.BuildingBlocks.Common;

public sealed record Error(string Code, string Message)
{
    public static readonly Error None = new(string.Empty, string.Empty);
    public static Error NotFound(string entity, string id) => new("not_found", $"{entity} '{id}' was not found.");
    public static Error Conflict(string entity, string id) => new("conflict", $"{entity} '{id}' already exists.");
}

public class Result
{
    protected Result(bool ok, Error error) { IsSuccess = ok; Error = error; }
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public Error Error { get; }
    public static Result Success() => new(true, Error.None);
    public static Result Failure(Error e) => new(false, e);
}

public sealed class Result<T> : Result
{
    private Result(T? value, bool ok, Error error) : base(ok, error) { Value = value; }
    public T? Value { get; }
    public static Result<T> Success(T value) => new(value, true, Error.None);
    public static new Result<T> Failure(Error e) => new(default, false, e);
}
