using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChoreoCreator.DataAccess.Configurations
{
    public class DancerPositionConfiguration : IEntityTypeConfiguration<DancerPositionEntity>
    {
        public void Configure(EntityTypeBuilder<DancerPositionEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.DancerNumber)
                .IsRequired();

            builder.Property(x => x.X)
                .IsRequired();

            builder.Property(x => x.Y)
                .IsRequired();

            builder.HasIndex(x => new { x.FormationId, x.DancerNumber })
                .IsUnique();

            builder.HasOne(x => x.Formation)
                .WithMany(f => f.DancerPositions)
                .HasForeignKey(x => x.FormationId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
