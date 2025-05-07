using ChoreoCreator.Core.Models;
using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChoreoCreator.DataAccess.Repositories
{
    public class FormationsRepository
    {
        private readonly ChoreoCreatorDbContext _context;

        public FormationsRepository(ChoreoCreatorDbContext context)
        {
            _context = context;
        }

        public async Task<List<Formation>> GetByScenarioId(Guid scenarioId)
        {
            var entities = await _context.Formations
                .Where(f => f.ScenarioId == scenarioId)
                .Include(f => f.DancerPositions)
                .AsNoTracking()
                .ToListAsync();

            return entities
                .Select(e =>
                {
                    var (formation, _) = Formation.Create(e.Id, e.ScenarioId, e.Order);
                    foreach (var p in e.DancerPositions)
                        formation.AddDancerPosition(new DancerPosition(p.DancerNumber, p.X, p.Y));
                    return formation;
                })
                .ToList();
        }

        public async Task<Guid> Create(Formation formation)
        {
            var entity = new FormationEntity
            {
                Id = formation.Id,
                ScenarioId = formation.ScenarioId,
                Order = formation.Order,
                DancerPositions = formation.DancerPositions
                    .Select(p => new DancerPositionEntity
                    {
                        DancerNumber = p.DancerNumber,
                        X = p.X,
                        Y = p.Y
                    })
                    .ToList()
            };

            await _context.Formations.AddAsync(entity);
            await _context.SaveChangesAsync();

            return entity.Id;
        }

        public async Task<Guid> Delete(Guid id)
        {
            await _context.Formations
                .Where(f => f.Id == id)
                .ExecuteDeleteAsync();

            return id;
        }
    }
}
