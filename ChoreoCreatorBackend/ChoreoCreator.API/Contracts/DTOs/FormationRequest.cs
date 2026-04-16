namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Данные формирования при создании или обновлении сценария.
    /// </summary>
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
