using ChoreoCreator.Core.Models;
using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace ChoreoCreator.DataAccess.Configurations
{
    public class ScenarioConfiguration : IEntityTypeConfiguration<ScenarioEntity>
    {
        public void Configure(EntityTypeBuilder<ScenarioEntity> builder)
        {
            builder.ToTable("t_scenarios");

            builder.HasKey(s => s.Id);

            builder.Property(s => s.Title)
                .HasMaxLength(64)
                .IsRequired();

            builder.Property(s => s.Description)
                .HasMaxLength(128);

            builder.Property(s => s.DancerCount)
                .IsRequired();

            builder.Property(s => s.UserId)
                .IsRequired();

            builder.Property(s => s.IsPublished)
                .IsRequired();

            builder.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId);

            builder.Property(s => s.FormationsJson)
                .HasColumnName("formations")
                .HasColumnType("jsonb")
                .IsRequired();
        }
    }
}
