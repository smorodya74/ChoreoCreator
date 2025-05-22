namespace ChoreoCreator.API.Contracts.DTOs
{
    public record DancerPositionRequest(
        Guid Id,
        int NumberInFormation, 
        PositionRequest Position);
}
