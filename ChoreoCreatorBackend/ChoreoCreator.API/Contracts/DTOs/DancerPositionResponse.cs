namespace ChoreoCreator.API.Contracts.DTOs
{
    public record DancerPositionResponse(
        Guid Id,
        int NumberInFormation,
        PositionResponse Position);
}