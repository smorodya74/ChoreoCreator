namespace ChoreoCreator.API.Contracts
{
    public record ScenariosResponse(
        Guid Id,
        string Title,
        string Description,
        int DancerCount,
        Guid UserId);
}
