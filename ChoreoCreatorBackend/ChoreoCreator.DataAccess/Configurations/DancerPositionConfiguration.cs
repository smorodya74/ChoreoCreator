using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChoreoCreator.DataAccess.Configurations
{
    public class DancerPositionConfiguration : IEntityTypeConfiguration<DancerPositionEntity>
    {
        public void Configure(EntityTypeBuilder<DancerPositionEntity> builder)
        {
            throw new NotImplementedException();
        }
    }
}
