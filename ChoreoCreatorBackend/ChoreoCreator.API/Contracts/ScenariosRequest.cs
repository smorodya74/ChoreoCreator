namespace ChoreoCreator.API.Contracts
{
    public record ScenariosRequest(
        string Title,
        string Description,
        int DancerCount,
        Guid UserId);
}
