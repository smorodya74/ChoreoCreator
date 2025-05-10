using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions;

public interface IScenariosRepository
{
    Task<Guid> Create(Scenario scenario);
    Task<Guid> Delete(Guid id);
    Task<List<Scenario>> Get();
    Task<Guid> Update(Guid id, string title, string description, int dancerCount, Guid userId, DateTime createdAt, DateTime updatedAt);
}