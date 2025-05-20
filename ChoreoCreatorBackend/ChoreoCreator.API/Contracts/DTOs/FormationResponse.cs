namespace ChoreoCreator.API.Contracts.DTOs
{
    public record FormationResponse(
        Guid Id,
        int NumberInScenario,
        List<DancerPositionResponse> DancerPositions);
}