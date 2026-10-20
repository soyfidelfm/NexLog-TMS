namespace NexLog.BuildingBlocks.Common;

public class NotFoundException(string entity, string id) : Exception($"{entity} '{id}' was not found.");
public class ConflictException(string entity, string id) : Exception($"{entity} '{id}' already exists.");
public class DomainValidationException(string message) : Exception(message);
