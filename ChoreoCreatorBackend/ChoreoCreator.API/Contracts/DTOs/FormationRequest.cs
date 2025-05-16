namespace ChoreoCreator.API.Contracts.DTOs
{
    public record FormationRequest(
        Guid Id,
        int NumberInScenario,
        List<DancerPositionRequest> DancerPositions);
}
