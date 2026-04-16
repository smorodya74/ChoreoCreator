namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Представление формирования в сценарии.
    /// </summary>
    public record FormationResponse(
        Guid Id,
        int NumberInScenario,
        int StartTimeMs,
        int DurationMs,
        int AnimationDurationMs,
        string Name,
        string Description,
        bool IsAutoName,
        List<DancerPositionResponse> DancerPositions);
}
