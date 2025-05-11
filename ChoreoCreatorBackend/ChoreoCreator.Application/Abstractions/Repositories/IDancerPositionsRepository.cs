using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions.Repositories;

public interface IDancerPositionsRepository
{
    Task<List<DancerPosition>> GetByFormationId(Guid formationId);
    Task<Guid> Create(DancerPosition position);
    Task<Guid> Update(Guid id, float x, float y);
    Task<Guid> Delete(Guid id);
}
