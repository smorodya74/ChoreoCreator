using ChoreoCreator.API.Contracts.DTOs;

namespace ChoreoCreator.API.Contracts.Scenario;

/// <summary>
/// Данные для обновления сценария.
/// </summary>
/// <param name="Title">Новое название сценария.</param>
/// <param name="Description">Новое описание сценария (может быть пустым).</param>
/// <param name="DancerCount">Количество танцоров в сценарии.</param>
/// <param name="Formations">Новый набор формирований и позиций.</param>
/// <param name="IsPublished">Нужно ли опубликовать сценарий.</param>
public record ScenarioUpdateRequest(
    string Title,
    string? Description,
    int DancerCount,
    List<FormationRequest> Formations,
    bool IsPublished);
