using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChoreoCreator.DataAccess.Configurations
{
    public class MarkerConfiguration : IEntityTypeConfiguration<MarkerEntity>
    {
        public void Configure(EntityTypeBuilder<MarkerEntity> builder)
        {
            throw new NotImplementedException();
        }
    }
}
