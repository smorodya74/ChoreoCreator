using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChoreoCreator.DataAccess
{
    public class ChoreoCreatorDbContext : DbContext
    {
        public ChoreoCreatorDbContext(DbContextOptions<ChoreoCreatorDbContext> options)
            : base(options)
        {            
        }

        public DbSet<ScenarioEntity> Scenarios { get; set; }
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<MarkerEntity> Markers { get; set; }
        public DbSet<FormationEntity> Formations { get; set; }
        public DbSet<DancerPositionEntity> DancerPositions { get; set; }
    }
}
