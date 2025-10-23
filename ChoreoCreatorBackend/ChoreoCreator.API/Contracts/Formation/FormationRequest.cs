using ChoreoCreator.API.Contracts.DancerPosition;

namespace ChoreoCreator.API.Contracts.Formation
{
    public record FormationRequest(
        Guid Id,
        int NumberInScenario,
        List<DancerPositionRequest> DancerPositions);
}
