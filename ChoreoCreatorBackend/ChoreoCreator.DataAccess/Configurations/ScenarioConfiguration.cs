using ChoreoCreator.Core.Models;
using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChoreoCreator.DataAccess.Configurations
{
    public class ScenarioConfiguration : IEntityTypeConfiguration<ScenarioEntity>
    {
        public void Configure(EntityTypeBuilder<ScenarioEntity> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(b => b.Title)
                .HasMaxLength(Scenario.MAX_TITLE_LENGTH)
                .IsRequired();

            builder.Property(b => b.Description)
                .HasMaxLength(Scenario.MAX_DESCRIPTION_LENGTH)
                .IsRequired();

            builder.Property(b => b.DancerCount)
                .IsRequired();

            builder.Property(b => b.UserId)
                .IsRequired();
        }
    }
}
