using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChoreoCreator.DataAccess.Configurations
{
    public class FormationConfiguration : IEntityTypeConfiguration<FormationEntity>
    {
        public void Configure(EntityTypeBuilder<FormationEntity> builder)
        {
            throw new NotImplementedException();
        }
    }
}
