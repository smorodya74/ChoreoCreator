using ChoreoCreator.Contracts.DTOs;

namespace ChoreoCreator.API.Contracts.DTOs
{
    public record DancerPositionResponse(
        int NumberInFormation,
        PositionResponse Position);
}