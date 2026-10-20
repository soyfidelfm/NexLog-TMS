namespace NexLog.Loads.Domain;

public class PlanningOrderRef
{
    public string Id { get; set; } = string.Empty;
    public string Customer { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal Volume { get; set; }
    public string Priority { get; set; } = "Medium";
}
