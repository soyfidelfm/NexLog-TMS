namespace NexLog.Rating.Domain;

public class QuoteRequest
{
    public string OriginCity { get; set; } = string.Empty;
    public string OriginZip { get; set; } = string.Empty;
    public string DestinationCity { get; set; } = string.Empty;
    public string DestinationZip { get; set; } = string.Empty;
    public decimal Weight { get; set; }
    public decimal? Length { get; set; }
    public decimal? Width { get; set; }
    public decimal? Height { get; set; }
    public int Pieces { get; set; }
    public string Commodity { get; set; } = string.Empty;
    public string PickupDate { get; set; } = string.Empty;
    public string ServiceLevel { get; set; } = "Standard";
}
