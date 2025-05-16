using ChoreoCreator.API.Contracts.DTOs;

namespace ChoreoCreator.Contracts.DTOs
{
    public record FormationResponse(
        Guid Id,
        int NumberInScenario,
        List<DancerPositionResponse> DancerPositions);
}