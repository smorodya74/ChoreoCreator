using ChoreoCreator.DataAccess.Configurations;
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ScenarioConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
