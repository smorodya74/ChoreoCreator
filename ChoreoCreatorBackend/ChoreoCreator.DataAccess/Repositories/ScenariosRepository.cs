using ChoreoCreator.Core.Abstractions;
using ChoreoCreator.Core.Models;
using ChoreoCreator.DataAccess.Entities;
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

        public async Task<List<Scenario>> Get()
        {
            var scenarioEntities = await _context.Scenarios
                .AsNoTracking()
                .ToListAsync();

            var scenarios = scenarioEntities
                .Select(b => Scenario.Create(b.Id, b.Title, b.Description, b.DancerCount, b.UserId, b.CreatedAt, b.UpdatedAt).Scenario)
                .ToList();

            return scenarios;
        }

        public async Task<Guid> Create(Scenario scenario)
        {
            var scenarioEntity = new ScenarioEntity
            {
                Id = scenario.Id,
                Title = scenario.Title,
                Description = scenario.Description,
                DancerCount = scenario.DancerCount,
                UserId = scenario.UserId,
                CreatedAt = scenario.CreatedAt,
                UpdatedAt = scenario.UpdatedAt,
            };

            await _context.Scenarios.AddAsync(scenarioEntity);
            await _context.SaveChangesAsync();

            return scenarioEntity.Id;
        }

        public async Task<Guid> Update(Guid id, string title, string description, int dancerCount, Guid userId, DateTime createdAt, DateTime updatedAt)
        {
            await _context.Scenarios
                .Where(s => s.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(s => s.Title, s => title)
                    .SetProperty(s => s.Description, s => description)
                    .SetProperty(s => s.DancerCount, s => dancerCount)
                    .SetProperty(s => s.UpdatedAt, s => DateTime.UtcNow));

            return id;
        }

        public async Task<Guid> Delete(Guid id)
        {
            await _context.Scenarios
                .Where(s => s.Id == id)
                .ExecuteDeleteAsync();

            return id;
        }
    }
}