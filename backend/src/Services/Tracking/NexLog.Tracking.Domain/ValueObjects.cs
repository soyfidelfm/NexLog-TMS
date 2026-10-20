namespace NexLog.Tracking.Domain;

public class MapPoint
{
    public double X { get; set; }
    public double Y { get; set; }
}

public class ShipmentAlert
{
    public string Type { get; set; } = "info"; // warning | info | error
    public string Message { get; set; } = string.Empty;
}

public class ShipmentTimelineItem
{
    public string Label { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public bool? Current { get; set; }
}
