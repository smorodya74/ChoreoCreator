namespace ChoreoCreator.API.Contracts.Scenario
{
    public record ScenariosRequest(
        string Title,
        string Description,
        int DancerCount,
        Guid UserId);
}