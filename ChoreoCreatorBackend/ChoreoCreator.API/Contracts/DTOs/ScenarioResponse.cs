namespace ChoreoCreator.API.Contracts.DTOs;

/// <summary>
/// Представление сценария для API.
/// </summary>
public class ScenarioResponse
{
    /// <summary>
    /// Идентификатор сценария.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Название сценария.
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Описание сценария.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Количество танцоров в сценарии.
    /// </summary>
    public int DancerCount { get; set; }

    /// <summary>
    /// Флаг публикации сценария.
    /// </summary>
    public bool IsPublished { get; set; }

    /// <summary>
    /// Общая длительность хореографии в миллисекундах.
    /// </summary>
    public int TotalDurationMs { get; set; }

    /// <summary>
    /// Имя пользователя-владельца сценария.
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Набор формирований сценария.
    /// </summary>
    public List<FormationResponse> Formations { get; set; } = new();

    /// <summary>
    /// Создаёт представление сценария для ответа API.
    /// </summary>
    /// <param name="id">Идентификатор сценария.</param>
    /// <param name="title">Название сценария.</param>
    /// <param name="description">Описание сценария.</param>
    /// <param name="dancerCount">Количество танцоров.</param>
    /// <param name="isPublished">Флаг публикации.</param>
    /// <param name="username">Имя пользователя-владельца.</param>
    /// <param name="formations">Формирования сценария.</param>
    public ScenarioResponse(
        Guid id,
        string title,
        string description,
        int dancerCount,
        bool isPublished,
        int totalDurationMs,
        string username,
        List<FormationResponse> formations)
    {
        Id = id;
        Title = title;
        Description = description;
        DancerCount = dancerCount;
        IsPublished = isPublished;
        TotalDurationMs = totalDurationMs;
        Username = username;
        Formations = formations;
    }
}
