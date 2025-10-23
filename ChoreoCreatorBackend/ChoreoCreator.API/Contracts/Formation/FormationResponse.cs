using ChoreoCreator.API.Contracts.DancerPosition;

namespace ChoreoCreator.API.Contracts.Formation
{
    public record FormationResponse(
        Guid Id,
        int NumberInScenario,
        List<DancerPositionResponse> DancerPositions);
}