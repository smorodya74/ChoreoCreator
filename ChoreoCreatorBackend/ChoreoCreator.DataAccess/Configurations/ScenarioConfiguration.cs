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
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Title)
                .HasMaxLength(Scenario.MAX_TITLE_LENGTH)
                .IsRequired();

            builder.Property(s => s.Description)
                .HasMaxLength(Scenario.MAX_DESCRIPTION_LENGTH)
                .IsRequired();

            builder.Property(s => s.DancerCount)
                .IsRequired();

            builder.Property(s => s.UserId)
                .IsRequired();
        }
    }
}
