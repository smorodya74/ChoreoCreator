namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Представление формирования в сценарии.
    /// </summary>
    /// <param name="Id">Идентификатор формирования.</param>
    /// <param name="NumberInScenario">Порядковый номер формирования в сценарии.</param>
    /// <param name="DancerPositions">Позиции танцоров в формировании.</param>
    public record FormationResponse(
        Guid Id,
        int NumberInScenario,
        List<DancerPositionResponse> DancerPositions);
}
