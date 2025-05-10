using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Core.Models;
using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChoreoCreator.DataAccess.Repositories
{
    public class DancerPositionsRepository : IDancerPositionsRepository
    {
        private readonly ChoreoCreatorDbContext _context;

        public DancerPositionsRepository(ChoreoCreatorDbContext context)
        {
            _context = context;
        }

        public async Task<List<DancerPosition>> GetByFormationId(Guid formationId)
        {
            var entities = await _context.DancerPositions
                .Where(p => p.FormationId == formationId)
                .AsNoTracking()
                .ToListAsync();

            return entities
                .Select(e => DancerPosition.Create(e.Id, e.FormationId, e.DancerNumber, e.X, e.Y).DancerPosition)
                .ToList();
        }

        public async Task<Guid> Create(DancerPosition position)
        {
            var entity = new DancerPositionEntity
            {
                Id = position.Id,
                FormationId = position.FormationId,
                DancerNumber = position.DancerNumber,
                X = position.X,
                Y = position.Y
            };

            await _context.DancerPositions.AddAsync(entity);
            await _context.SaveChangesAsync();

            return entity.Id;
        }

        public async Task<Guid> Update(Guid id, float x, float y)
        {
            await _context.DancerPositions
                .Where(p => p.Id == id)
                .ExecuteUpdateAsync(p => p
                    .SetProperty(e => e.X, e => x)
                    .SetProperty(e => e.Y, e => y));

            return id;
        }

        public async Task<Guid> Delete(Guid id)
        {
            await _context.DancerPositions
                .Where(p => p.Id == id)
                .ExecuteDeleteAsync();

            return id;
        }
    }
}
