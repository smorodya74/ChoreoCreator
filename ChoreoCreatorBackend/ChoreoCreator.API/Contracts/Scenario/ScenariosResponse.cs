namespace ChoreoCreator.API.Contracts.Scenario;

public record ScenariosResponse(
    Guid Id,
    string Title,
    string Description,
    int DancerCount,
    Guid UserId,
    DateTime CreatedAt,
    DateTime UpdatedAt);