namespace NexLog.Orders.Domain;

public class OrderOriginDest
{
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Flag { get; set; } = string.Empty;
}

public class OrderDetailOrigin
{
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Window { get; set; } = string.Empty;
}

public class OrderDimensions
{
    public decimal LengthFt { get; set; }
    public decimal WidthFt { get; set; }
    public decimal HeightFt { get; set; }
    public decimal LengthM { get; set; }
    public decimal WidthM { get; set; }
    public decimal HeightM { get; set; }
}

public class OrderTimelineStep
{
    public string Label { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public bool Current { get; set; }
    public bool? Estimated { get; set; }
}

public class OrderItem
{
    public string Sku { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal WeightLbs { get; set; }
}
