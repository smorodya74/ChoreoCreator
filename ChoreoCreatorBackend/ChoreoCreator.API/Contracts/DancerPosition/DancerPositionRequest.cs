namespace ChoreoCreator.API.Contracts.DancerPosition
{
    public record DancerPositionRequest(
        Guid Id,
        int NumberInFormation,
        string DancerColor,
        PositionRequest Position);
}
