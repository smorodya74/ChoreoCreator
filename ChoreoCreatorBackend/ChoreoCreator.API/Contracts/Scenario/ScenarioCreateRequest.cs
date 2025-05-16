using ChoreoCreator.API.Contracts.DTOs;

namespace ChoreoCreator.API.Contracts.Scenario;

public record ScenarioCreateRequest(
        string Title,
        string? Description,
        int DancerCount,
        bool IsPublished,
        List<FormationRequest> Formations);