using ChoreoCreator.API.Contracts.DTOs;

namespace ChoreoCreator.API.Contracts.Scenario;

public record ScenarioUpdateRequest(
    string Title,
    string? Description,
    int DancerCount,
    List<FormationRequest> Formations,
    bool IsPublished);
