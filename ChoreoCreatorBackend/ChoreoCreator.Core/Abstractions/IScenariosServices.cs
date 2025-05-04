using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Core.Abstractions
{
    public interface IScenariosServices
    {
        Task<Guid> CreateScenario(Scenario scenario);
        Task<Guid> DeleteScenario(Guid id);
        Task<List<Scenario>> GetAllScenarios();
        Task<Guid> UpdateScenario(Guid id, string title, string description, int dancerCount, Guid userId, DateTime createdAt, DateTime updatedAt);
    }
}