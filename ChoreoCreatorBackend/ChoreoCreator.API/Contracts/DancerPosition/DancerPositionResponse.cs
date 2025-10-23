namespace ChoreoCreator.API.Contracts.DancerPosition
{
    public record DancerPositionResponse(
        Guid Id,
        int NumberInFormation,
        PositionResponse Position);
}