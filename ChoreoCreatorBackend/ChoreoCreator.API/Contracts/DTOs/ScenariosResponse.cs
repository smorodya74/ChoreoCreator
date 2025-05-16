using ChoreoCreator.Contracts.DTOs;

namespace ChoreoCreator.API.Contracts.DTOs
{
    public record ScenariosResponse(
        Guid Id,
        string Title,
        string Description,
        int DancerCount,
        Guid UserId,
        bool IsPublished,
        List<FormationResponse> Formation);
}