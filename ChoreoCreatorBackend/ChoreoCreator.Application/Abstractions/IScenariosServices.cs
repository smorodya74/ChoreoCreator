using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions
{
    public interface IScenariosServices
    {
        Task<List<Scenario>> GetAllScenarios();
        Task<Scenario?> GetScenarioById(Guid id);
        Task<Scenario?> GetScenarioByUserId(Guid userId);
        Task<Guid> CreateScenario(Scenario scenario);
        Task<bool> DeleteScenario(Guid id);
        Task<bool> UpdateScenario(Scenario scenario);
    }
}