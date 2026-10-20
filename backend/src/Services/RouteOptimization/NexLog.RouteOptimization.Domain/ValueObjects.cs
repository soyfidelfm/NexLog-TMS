namespace NexLog.RouteOptimization.Domain;

public class Stop
{
    public string Name { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
    public string Eta { get; set; } = string.Empty;
    public string Type { get; set; } = "delivery"; // depot | pickup | delivery
}

public class RouteMetrics
{
    public decimal Km { get; set; }
    public decimal Cost { get; set; }
    public decimal Hours { get; set; }
    public int Vehicles { get; set; }
}
