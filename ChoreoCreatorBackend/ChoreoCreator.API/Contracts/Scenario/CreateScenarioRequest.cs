using ChoreoCreator.API.Contracts.Formation;

namespace ChoreoCreator.API.Contracts.Scenario;

public class CreateScenarioRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DancerCount { get; set; }
    public bool IsPublished { get; set; }
    public List<FormationRequest> Formations { get; set; } = [];
}