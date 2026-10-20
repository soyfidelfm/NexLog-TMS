namespace NexLog.Exceptions.Domain;

public class TimelineEvent
{
    public string Time { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Actor { get; set; } = string.Empty;
}

public class ActionTaken
{
    public string Id { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string By { get; set; } = string.Empty;
    public string At { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class CommLog
{
    public string Id { get; set; } = string.Empty;
    public string Channel { get; set; } = "System"; // Email | Phone | SMS | Chat | System
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string At { get; set; } = string.Empty;
    public string Direction { get; set; } = "outbound"; // inbound | outbound
}
