using BidX.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BidX.DataAccess.Configs;

public class BidConfig : IEntityTypeConfiguration<Bid>
{

    public void Configure(EntityTypeBuilder<Bid> builder)
    {
        builder.Property(b => b.Amount)
            .HasPrecision(18, 0);

        // Needed in GetHighestBid()
        // Needed in ProjectToAuctionResponse(), ProjectToAuctionDetailsResponse() and PlaceBid() for:
        //  - Calculating Auction CurruentPrice
        builder.HasIndex(b => new { b.AuctionId, b.Amount, b.IsAccepted }); // Composite index optimizes bid lookups for current price calculations
    }

}
