namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Данные формирования при создании или обновлении сценария.
    /// </summary>
    /// <param name="Id">Идентификатор формирования (может игнорироваться при создании).</param>
    /// <param name="NumberInScenario">Порядковый номер формирования в сценарии.</param>
    /// <param name="DancerPositions">Позиции танцоров в формировании.</param>
    public record FormationRequest(
        Guid Id,
        int NumberInScenario,
        int StartTimeMs,
        int DurationMs,
        int AnimationDurationMs,
        string Name,
        string Description,
        List<DancerPositionRequest> DancerPositions,
        bool IsAutoName = true);
}
