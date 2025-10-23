namespace ChoreoCreator.API.Contracts.DancerPosition
{
    public record DancerPositionRequest(
        Guid Id,
        int NumberInFormation, 
        PositionRequest Position);
}
