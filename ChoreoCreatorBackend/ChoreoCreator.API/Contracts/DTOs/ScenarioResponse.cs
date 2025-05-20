namespace ChoreoCreator.API.Contracts.DTOs;

public class ScenarioResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DancerCount { get; set; }
    public bool IsPublished { get; set; }
    public string Username { get; set; } = string.Empty; 
    public List<FormationResponse> Formations { get; set; } = new();

    public ScenarioResponse(
        Guid id,
        string title,
        string description,
        int dancerCount,
        bool isPublished,
        string username,
        List<FormationResponse> formations)
    {
        Id = id;
        Title = title;
        Description = description;
        DancerCount = dancerCount;
        IsPublished = isPublished;
        Username = username;
        Formations = formations;
    }
}