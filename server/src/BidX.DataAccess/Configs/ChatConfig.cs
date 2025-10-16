using BidX.DataAccess.Entites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BidX.DataAccess.Configs;

public class ChatConfig : IEntityTypeConfiguration<Chat>
{
    public void Configure(EntityTypeBuilder<Chat> builder)
    {
        builder.HasOne(c => c.Participant1)
            .WithMany()
            .HasForeignKey(c => c.Participant1Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Participant2)
            .WithMany()
            .HasForeignKey(c => c.Participant2Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.LastMessage)
            .WithOne()
            .HasForeignKey<Chat>(c => c.LastMessageId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        // Needed in GetUserChats for:
        //  - Filtering by (Participant1Id == userId || Participant2Id == userId)
        // Without these 2 indexes the db will do a full scan but by adding them it will:
        //  - Seek participant1Id index --> Seek participant2Id index --> Combines the results
        builder.HasIndex(c => c.Participant1Id); // Composite indexes with INCLUDE are not supported in MySQL, simple index still improves lookups

        builder.HasIndex(c => c.Participant2Id);

    }

}
