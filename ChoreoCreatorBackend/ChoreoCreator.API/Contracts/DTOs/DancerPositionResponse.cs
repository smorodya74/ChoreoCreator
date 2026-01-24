namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Представление позиции танцора в формировании.
    /// </summary>
    /// <param name="Id">Идентификатор позиции танцора.</param>
    /// <param name="NumberInFormation">Порядковый номер танцора в формировании.</param>
    /// <param name="Position">Координаты позиции.</param>
    public record DancerPositionResponse(
        Guid Id,
        int NumberInFormation,
        PositionResponse Position);
}
