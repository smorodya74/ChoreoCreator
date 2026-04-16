namespace ChoreoCreator.API.Contracts.DTOs;

/// <summary>
/// Данные для создания сценария.
/// </summary>
public class CreateScenarioRequest
{
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
    /// Нужно ли публиковать сценарий сразу после создания.
    /// </summary>
    public bool IsPublished { get; set; }

    /// <summary>
    /// Общая длительность хореографии в миллисекундах.
    /// </summary>
    public int TotalDurationMs { get; set; } = 10000;

    /// <summary>
    /// Список формирований с позициями танцоров.
    /// </summary>
    public List<FormationRequest> Formations { get; set; } = [];
}
