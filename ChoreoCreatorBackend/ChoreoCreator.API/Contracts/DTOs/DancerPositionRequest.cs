namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Данные о позиции танцора в формировании.
    /// </summary>
    /// <param name="Id">Идентификатор позиции танцора.</param>
    /// <param name="NumberInFormation">Порядковый номер танцора в формировании.</param>
    /// <param name="Position">Координаты позиции.</param>
    public record DancerPositionRequest(
        Guid Id,
        int NumberInFormation,
        PositionRequest Position);
}
