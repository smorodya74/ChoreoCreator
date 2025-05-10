using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions;

public interface IFormationsRepository
{
    Task<List<Formation>> GetByScenarioId(Guid scenarioId);
    Task<Guid> Create(Formation formation);
    Task<Guid> Delete(Guid id);
}
