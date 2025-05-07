using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChoreoCreator.DataAccess.Configurations
{
    public class FormationConfiguration : IEntityTypeConfiguration<FormationEntity>
    {
        public void Configure(EntityTypeBuilder<FormationEntity> builder)
        {
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Order)
                .IsRequired();

            builder.HasOne(f => f.Scenario)
                .WithMany(s => s.Formations)
                .HasForeignKey(f => f.ScenarioId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(f => new { f.ScenarioId, f.Order })
                .IsUnique();
        }
    }
}
