namespace BidX.DataAccess.Entites;

public class Category
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public required string IconUrl { get; set; }

    public bool IsDeleted { get; set; }
}
