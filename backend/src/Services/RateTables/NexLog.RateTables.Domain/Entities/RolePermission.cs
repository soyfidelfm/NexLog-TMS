using NexLog.BuildingBlocks.Domain;

namespace NexLog.RateTables.Domain.Entities;

public class RolePermission : Entity
{
    public string Role { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool View { get; set; }
    public bool CreateEdit { get; set; }
    public bool Delete { get; set; }
    public bool Approve { get; set; }
    public bool Export { get; set; }
    public bool ManagePermissions { get; set; }
}
