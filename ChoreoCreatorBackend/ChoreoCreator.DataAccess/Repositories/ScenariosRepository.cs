using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Core.Models;
using ChoreoCreator.DataAccess.Entities;
using ChoreoCreator.DataAccess.Mapping;
using Microsoft.EntityFrameworkCore;

namespace ChoreoCreator.DataAccess.Repositories
{
    public class ScenariosRepository : IScenariosRepository
    {
        private readonly ChoreoCreatorDbContext _context;

        public ScenariosRepository(ChoreoCreatorDbContext context)
        {
            _context = context;
        }

        public async Task<Scenario?> GetByIdAsync(Guid id)
        {
            var entity = await _context.Scenarios
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            return entity?.ToDomain();
        }

        public async Task<Scenario?> GetByUserIdAsync(Guid userId)
        {
            var entity = await _context.Scenarios
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.UserId == userId);

            return entity?.ToDomain();
        }

        public async Task<List<Scenario>> GetAllAsync()
        {
            var entities = await _context.Scenarios
                .AsNoTracking()
                .ToListAsync();

            return entities.Select(e => e.ToDomain()).ToList();
        }

        public async Task SaveAsync(Scenario scenario)
        {
            var entity = await _context.Scenarios
                .FirstOrDefaultAsync(s => s.Id == scenario.Id);

            if (entity == null)
            {
                _context.Scenarios.Add(scenario.ToEntity());
            }
            else
            {
                // обновляем существующую запись
                var updated = scenario.ToEntity();

                entity.Title = updated.Title;
                entity.Description = updated.Description;
                entity.DancerCount = updated.DancerCount;
                entity.IsPublished = updated.IsPublished;
                entity.UserId = updated.UserId;
                entity.FormationsJson = updated.FormationsJson;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var entity = await _context.Scenarios.FindAsync(id);
            if (entity == null)
                return false;

            _context.Scenarios.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}