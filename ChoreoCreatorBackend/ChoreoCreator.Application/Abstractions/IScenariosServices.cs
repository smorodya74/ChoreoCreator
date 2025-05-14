using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions;

public interface IScenariosServices
{
    Task<Guid> CreateScenario(Scenario scenario);
    Task<Guid> DeleteScenario(Guid id);
    Task<List<Scenario>> GetAllScenarios();
    Task<Guid> UpdateScenario(Guid id, string title, string description, int dancerCount, Guid userId);
}